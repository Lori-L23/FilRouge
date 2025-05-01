<?php

namespace App\Models;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\Reservation;

use Illuminate\Database\Eloquent\Model;


class Repetiteur extends Model
{
    protected $fillable = [
        'user_id', 'matieres', 'niveaux', 'biographie', 
        'statut_verif', 'rayon_intervention', 'photo'
    ];
    protected $casts = [
        'matieres' => 'array',
        // 'niveaux' => 'array'
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
        return $this->belongsToMany(Matiere::class, 'repetiteur_matiere', 'repetiteur_id', 'matiere_id');
    }
    
public function reservations()
{
    return $this->hasMany(Reservation::class);
}
}
