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
        'statut',
    ];

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
}

