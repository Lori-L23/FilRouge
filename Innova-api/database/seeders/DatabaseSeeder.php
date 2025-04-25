<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'telephone' => '699999999',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'statut' => 'actif',
            'date_naissance' => '1990-01-01'
        ]);

        $this->call(MatieresTableSeeder::class);
        $this->call(CategoriesTableSeeder::class);

        
    }
}
