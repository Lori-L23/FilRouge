<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'reservation_id',
        'cours_id',
        'montant',
        'statut',
        'mode_paiement',
        'date_paiement'
        // Ajoutez si vous avez d'autres champs
        // 'reference',
        // 'description'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
}
