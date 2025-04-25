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

    public function repetiteurs()
    {
        return $this->belongsToMany(User::class, 'cours', 'matiere_id', 'repetiteur_id')
                    ->where('role', 'repetiteur')
                    ->distinct();
    }
}
