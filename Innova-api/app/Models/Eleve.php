<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Cours;
use App\Models\Reservation;

class Eleve extends Model
{
     use HasFactory;
    protected $fillable = [
        'user_id',
        'niveau_scolaire',
        'date_naissance',
        'objectif',

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
