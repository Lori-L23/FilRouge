<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    protected $fillable = [
        'user_id',
        'niveau_scolaire',
        'date_naissance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function cours()
    {
        return $this->hasMany(Cours::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}
