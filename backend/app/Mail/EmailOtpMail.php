<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $code,
        public int $minutes,
        public string $type = 'email_verify' // ✅ match DB enum
    ) {
    }

    public function build()
    {
        $subject = $this->type === 'reset_password'
            ? 'Password Reset OTP'
            : 'Email Verification OTP';

        return $this->subject($subject)
            ->view('emails.otp')
            ->with([
                'name' => $this->name,
                'code' => $this->code,
                'minutes' => $this->minutes,
                'type' => $this->type,
            ]);
    }
}
