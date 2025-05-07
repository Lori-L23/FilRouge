<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cours;
use App\Models\Repetiteur;
use App\Models\Paiement;
use App\Models\Transaction;
use App\Models\Lieu;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'repetiteur_id',
        'cours_id',
        'lieu_id',
        'prix_total',
        'date_reservation', 
        'statut'
    ];
    protected $casts = [
     'date_reservation' => 'datetime',
     'id' => 'integer',
     'eleve_id' => 'integer',
     'prix' => 'float',
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
        return $this->belongsTo(Eleve::class);
    }

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }
    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }
    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }
    public function lieu()
    {
        return $this->belongsTo(Lieu::class);
    }


    
}
