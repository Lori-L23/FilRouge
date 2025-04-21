<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repetiteur extends Model
{
    protected $fillable = [
        'user_id',
        'matieres',
        'niveaux',
        'biographie',
        'statut_verif',
        'rayon_intervention',
        'photo',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }
    public function matieres()
    {
        return $this->belongsTo(Matiere::class);
    }
}
