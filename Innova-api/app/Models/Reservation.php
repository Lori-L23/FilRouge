<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'repetiteur_id',
        'date_reservation', 
        'statut'
    ];
    protected $casts = [
     'date_reservation' => 'datetime',
        'statut' => 'string'
    ];
    /** 
     * Relations
     */
    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }

    public function eleve()
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }
    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }


    
}
