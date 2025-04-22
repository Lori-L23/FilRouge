<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'montant',
        'methode',
        'statut',
        'transaction_id',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}

