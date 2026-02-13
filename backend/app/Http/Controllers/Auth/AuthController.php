<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private int $otpMinutes = 10;
    private int $maxOtpAttempts = 5;

    // ---------- REGISTER ----------
    public function register(Request $request)
    {
        $validateUser = Validator::make($request->all(), [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required|min:8',
        ]);

        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validateUser->errors(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => null,
            'status' => 'active',
            'role' => 'employee', // ✅ default role
        ]);

        $this->sendOtpForUser($user, 'email_verify');

        return response()->json([
            'status' => true,
            'message' => 'OTP sent to your email. Please verify.',
            'email' => $user->email,
        ], 201);
    }

    // ---------- VERIFY EMAIL OTP ----------
    public function verifyEmailOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|min:4|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'status' => true,
                'message' => 'Email already verified.',
            ], 200);
        }

        $otp = EmailOtp::where('user_id', $user->id)
            ->where('type', 'email_verify')
            ->whereNull('consumed_at')
            ->latest('id')
            ->first();

        if (!$otp) {
            return response()->json([
                'status' => false,
                'message' => 'OTP not found. Please resend.',
                'errors' => ['code' => ['OTP not found. Please resend.']],
            ], 400);
        }

        if (now()->greaterThan($otp->expires_at)) {
            return response()->json([
                'status' => false,
                'message' => 'OTP expired. Please resend.',
                'errors' => ['code' => ['OTP expired. Please resend.']],
            ], 400);
        }

        if ($otp->attempts >= $this->maxOtpAttempts) {
            return response()->json([
                'status' => false,
                'message' => 'Too many attempts. Please resend OTP.',
                'errors' => ['code' => ['Too many attempts. Please resend OTP.']],
            ], 429);
        }

        $otp->increment('attempts');

        if (!Hash::check($request->code, $otp->code_hash)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid OTP.',
                'errors' => ['code' => ['Invalid OTP.']],
            ], 400);
        }

        $user->forceFill(['email_verified_at' => now()])->save();
        $otp->update(['consumed_at' => now()]);

        return response()->json([
            'status' => true,
            'message' => 'Email verified successfully. You can login now.',
        ], 200);
    }

    // ---------- RESEND OTP ----------
    public function resendEmailOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'status' => true,
                'message' => 'Email already verified.',
            ], 200);
        }

        // ✅ resend generates a new OTP (invalidate old)
        $this->sendOtpForUser($user, 'email_verify', true);

        return response()->json([
            'status' => true,
            'message' => 'OTP resent to your email.',
        ], 200);
    }

    // ---------- LOGIN (STATEFUL SANCTUM - session) ----------
    public function login(Request $request)
    {
        $validateUser = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validateUser->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid details.',
                'errors' => $validateUser->errors(),
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials.',
                'errors' => [
                    'email' => ['Invalid email or password.'],
                ],
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->status === 'suspended') {
            Auth::logout();

            return response()->json([
                'status' => false,
                'code' => 'ACCOUNT_SUSPENDED',
                'message' => 'Your account has been suspended.',
                'errors' => [
                    'password' => ['Your account is suspended. Please contact administration.'],
                ],
            ], 403);
        }

        if (!$user->email_verified_at) {
            Auth::logout();

            // ✅ resend OTP automatically (optional)
            $this->sendOtpForUser($user, 'email_verify', true);

            return response()->json([
                'status' => false,
                'code' => 'EMAIL_NOT_VERIFIED',
                'message' => 'Please verify your email first.',
                'email' => $user->email,
                'errors' => [
                    'email' => ['Email not verified. OTP has been sent again.'],
                ],
            ], 403);
        }

        // ✅ important for session security
        $request->session()->regenerate();

        return response()->json([
            'status' => true,
            'message' => 'Logged in successfully.',
            'user' => $user,
        ], 200);
    }

    // ---------- LOGOUT ----------
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully.',
        ], 200);
    }

    // ---------- ME ----------
    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user(),
        ], 200);
    }

    // -------------------------- Forgot Password --------------------------
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // ✅ generate + send reset OTP (force new)
        $this->sendOtpForUser($user, 'reset_password', true);

        return response()->json([
            'status' => true,
            'message' => 'Reset OTP sent to your email.',
            'email' => $user->email,
        ], 200);
    }

    public function verifyResetOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|min:4|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        $otp = EmailOtp::where('user_id', $user->id)
            ->where('type', 'reset_password')
            ->whereNull('consumed_at')
            ->latest('id')
            ->first();

        if (!$otp) {
            return response()->json([
                'status' => false,
                'message' => 'OTP not found. Please resend.',
                'errors' => ['code' => ['OTP not found. Please resend.']],
            ], 400);
        }

        if (now()->greaterThan($otp->expires_at)) {
            return response()->json([
                'status' => false,
                'message' => 'OTP expired. Please resend.',
                'errors' => ['code' => ['OTP expired. Please resend.']],
            ], 400);
        }

        if ($otp->attempts >= $this->maxOtpAttempts) {
            return response()->json([
                'status' => false,
                'message' => 'Too many attempts. Please resend OTP.',
                'errors' => ['code' => ['Too many attempts. Please resend OTP.']],
            ], 429);
        }

        $otp->increment('attempts');

        if (!Hash::check($request->code, $otp->code_hash)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid OTP.',
                'errors' => ['code' => ['Invalid OTP.']],
            ], 400);
        }

        // ✅ mark OTP as "verified" by consuming it
        $otp->update(['consumed_at' => now()]);

        return response()->json([
            'status' => true,
            'message' => 'OTP verified. You can reset password now.',
            'email' => $user->email,
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
            'password_confirmation' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // ✅ security: ensure there was a recent "consumed" reset otp
        $recentConsumed = EmailOtp::where('user_id', $user->id)
            ->where('type', 'reset_password')
            ->whereNotNull('consumed_at')
            ->where('consumed_at', '>=', now()->subMinutes($this->otpMinutes + 5))
            ->latest('id')
            ->first();

        if (!$recentConsumed) {
            return response()->json([
                'status' => false,
                'message' => 'Please verify OTP first.',
                'errors' => [
                    'email' => ['Please verify OTP first.'],
                ],
            ], 403);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Password reset successfully. You can login now.',
        ], 200);
    }

    // ---------- PRIVATE: SEND OTP ----------
    private function sendOtpForUser(User $user, string $type = 'email_verify', bool $forceNew = false): EmailOtp
    {
        if (!$forceNew) {
            $existing = EmailOtp::where('user_id', $user->id)
                ->where('type', $type)
                ->whereNull('consumed_at')
                ->where('expires_at', '>', now())
                ->latest('id')
                ->first();

            if ($existing) {
                return $existing;
            }
        }

        $code = (string) random_int(100000, 999999);

        // ✅ invalidate old active OTPs for SAME type
        EmailOtp::where('user_id', $user->id)
            ->where('type', $type)
            ->whereNull('consumed_at')
            ->update(['consumed_at' => now()]);

        $otp = EmailOtp::create([
            'user_id' => $user->id,
            'type' => $type,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes($this->otpMinutes),
            'attempts' => 0,
        ]);

        Mail::to($user->email)->send(
            new EmailOtpMail($user->name, $code, $this->otpMinutes, $type)
        );

        return $otp;
    }
}
