<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
   protected $fillable = [
'eleve_id',
'repetiteur_id',
'lieu_id',
'statut',
'date_debut',
   ];

   public function cours()
{
    return $this->hasMany(Cours::class);
}

// Cours.php
public function reservation()
{
    return $this->belongsTo(Reservation::class);
}
}
