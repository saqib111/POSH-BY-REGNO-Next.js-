<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect(Request $request)
    {
        // "stateless" because API routes don't use session state like web routes
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function callback(Request $request)
    {
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $email = $googleUser->getEmail();
            $googleId = $googleUser->getId();
            $name = $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Google User');
            $avatar = $googleUser->getAvatar();

            // ✅ Find by google_id OR email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if (!$user) {
                // ✅ Create new user (default employee)
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'profile_pic' => $avatar,
                    'email_verified_at' => now(),
                    'status' => 'active',
                    'role' => 'employee',
                    // random password (won't be used)
                    'password' => bcrypt(Str::random(32)),
                ]);
            } else {
                // ✅ Update user if needed
                $user->google_id = $user->google_id ?: $googleId;
                $user->profile_pic = $avatar ?: $user->profile_pic;

                // if email matches google email, mark verified
                if (!$user->email_verified_at) {
                    $user->email_verified_at = now();
                }

                $user->save();
            }

            // ✅ blocked users
            if ($user->status === 'suspended') {
                // redirect to your suspended page
                return redirect()->away($frontendUrl . '/suspended-user');
            }

            // ✅ Log in with session (stateful sanctum)
            Auth::login($user);
            $request->session()->regenerate();

            // ✅ Redirect by role
            if ($user->role === 'admin' || $user->role === 'manager') {
                return redirect()->away($frontendUrl . '/admin/dashboard');
            }

            return redirect()->away($frontendUrl . '/');
        } catch (\Throwable $e) {
            return redirect()->away($frontendUrl . '/login?google=failed');
        }
    }
}
