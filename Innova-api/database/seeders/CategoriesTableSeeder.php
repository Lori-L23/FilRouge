<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Scientifique', 'slug' => 'scientifique'],
            ['name' => 'Langues', 'slug' => 'langues'],
            ['name' => 'Littéraire', 'slug' => 'litteraire'],
            ['name' => 'Humanités', 'slug' => 'humanites'],
        ];

        DB::table('categories')->insert($categories);
    }
}