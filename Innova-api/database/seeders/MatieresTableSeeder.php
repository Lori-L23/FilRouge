<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Matiere;


class MatieresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $matieres = [
            ['nom' => 'Mathématiques', 'niveau' => 'college/lycee'],
            ['nom' => 'Physique-Chimie', 'niveau' => 'college/lycee'],
            ['nom' => 'Français', 'niveau' => 'primaire'],
            ['nom' => 'Anglais', 'niveau' => 'primaire'],
            ['nom' => 'Histoire-Géo', 'niveau' => 'college/lycee'],
        ];
    
        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
        }
    }
}
