<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'repetiteur_id',
        'eleve_id',
        'date_cours',
        'heure_debut',
        'heure_fin',
        'lieu_cours',
       
    ];

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }
    public function matiere()
    {
        return $this->hasMany(Matiere::class);
    }
}
