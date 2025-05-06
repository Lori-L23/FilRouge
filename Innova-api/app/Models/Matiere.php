<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    protected $fillable = ['nom', 'niveau'];

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

    // public function repetiteurs()
    // {
    //     return $this->belongsToMany(User::class, 'cours', 'matiere', 'repetiteur_id')
    //        ->whereHas('role', 'repetiteur') // Si le rôle est géré via une relation
    //        ->distinct();
    // }
}
