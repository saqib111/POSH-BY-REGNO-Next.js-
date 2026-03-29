<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->with([
                'prompt' => 'select_account',
            ])
            ->redirect();
    }

    public function callback(Request $request)
    {
        $frontendUrl = rtrim(
            config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')),
            '/'
        );

        try {
            $googleUser = Socialite::driver('google')->user();

            $email = $googleUser->getEmail();
            $googleId = $googleUser->getId();
            $name = $googleUser->getName() ?: ($googleUser->getNickname() ?: 'Google User');
            $avatar = $googleUser->getAvatar();

            if (!$email) {
                return redirect()->away($frontendUrl . '/login?google=failed');
            }

            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'profile_pic' => $avatar,
                    'email_verified_at' => now(),
                    'status' => 'active',
                    'role' => 'employee',
                    'password' => bcrypt(Str::random(32)),
                ]);
            } else {
                if (!$user->google_id) {
                    $user->google_id = $googleId;
                }

                if ($avatar) {
                    $user->profile_pic = $avatar;
                }

                if (!$user->email_verified_at) {
                    $user->email_verified_at = now();
                }

                $user->save();
            }

            if ($user->status === 'suspended') {
                return redirect()->away($frontendUrl . '/suspended-user');
            }

            Auth::guard('web')->login($user, true);
            $request->session()->regenerate();

            if ($user->role === 'admin' || $user->role === 'manager') {
                return redirect()->away($frontendUrl . '/admin/dashboard');
            }

            return redirect()->away($frontendUrl . '/');
        } catch (\Throwable $e) {
            Log::error('Google OAuth failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect()->away($frontendUrl . '/login?google=failed');
        }
    }
}