<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // ✅ what OTP is for (verify email / reset password)
            $table->enum('type', ['email_verify', 'reset_password'])->default('email_verify');

            // ✅ hashed OTP
            $table->string('code_hash');

            $table->timestamp('expires_at');
            $table->timestamp('consumed_at')->nullable();

            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestamps();

            // ✅ Fast lookups for latest valid OTP
            $table->index(['user_id', 'type', 'consumed_at']);
            $table->index(['user_id', 'type', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
};
