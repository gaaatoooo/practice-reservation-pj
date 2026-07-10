<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'test@example.com'], // このメールアドレスの人がいるか探す
            [
                'name' => 'Test User',
            ]
        );

        $this->call([
            PlanSeeder::class,
            RoomAvailabilitySeeder::class,
        ]);
    }
}
