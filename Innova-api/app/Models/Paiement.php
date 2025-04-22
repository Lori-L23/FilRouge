<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
   protected $fillable = [
    'reservation_id',
    'montant',
    'statut',
    'methode',
    'transaction_id'
   ];

   public function reservations()
    {
        return $this->belongsToMany(Reservation::class);
    }
}
