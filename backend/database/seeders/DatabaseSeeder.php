<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $totalRecords = 100000;
        $chunkSize = 5000;

        // Pre-hash the password so we don't waste CPU time hashing 100k times
        $password = Hash::make('password');

        $this->command->info("Starting to seed $totalRecords users...");

        for ($i = 0; $i < $totalRecords; $i += $chunkSize) {
            $data = [];

            // Manually create the data array to ensure every field is included
            for ($j = 0; $j < $chunkSize; $j++) {
                $data[] = [
                    'name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'password' => $password, // Manually including the password
                    'status' => fake()->randomElement(['active', 'suspended']),
                    'role' => fake()->randomElement(['admin', 'manager', 'employee']),
                    'profile_pic' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Perform the bulk insert
            DB::table('users')->insert($data);

            $this->command->comment("Inserted " . ($i + $chunkSize) . " users...");
        }

        $this->command->info("Success! 100,000 users generated.");
    }
}
