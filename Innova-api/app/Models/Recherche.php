<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recherche extends Model
{
    protected $fillable =[
'niveau',
'rayon',
'disponibilite',
'tri',
'matiere_id',
    ];

    // public function matieres()
    // {
    //     return $this->belongsTo(Matiere::class);
    // }
}
