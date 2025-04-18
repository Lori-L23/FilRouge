<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    protected $fillable = [
        'nom',
        // 'description',
        'niveau',
    ];

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

    public function repetiteurs()
    {
        return $this->belongsToMany(Repetiteur::class, 'matiere_repetiteur');
    }
}
