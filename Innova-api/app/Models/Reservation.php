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
        'cours_id', 
        'matiere_id', 
        'date',
        'heure',
        'duree_heures',
        'prix_total',
        'statut',
        'statut_paiement',
        'notes',
        'lieu_id' // Ajouté si utilisé
    ];

    protected $casts = [
        'date' => 'date:Y-m-d', // Format explicite
        'heure' => 'string', // Stocké comme string pour HH:MM:SS
        'duree_heures' => 'decimal:2', // Meilleure précision
        'prix_total' => 'decimal:2'
    ];

    // Relations avec withDefault() pour éviter les erreurs
    public function cours()
    {
        return $this->belongsTo(Cours::class)->withDefault();
    }

    public function eleve()
    {
        return $this->belongsTo(Eleve::class)->withDefault();
    }

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class)->withDefault();
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class)->withDefault();
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class)->withDefault();
    }

    public function lieu()
    {
        return $this->belongsTo(Lieu::class)->withDefault();
    }

    // Nouvelle méthode pour vérifier la disponibilité
    public static function isTimeSlotAvailable($repetiteurId, $date, $heure, $duree)
    {
        $start = \Carbon\Carbon::parse("$date $heure");
        $end = $start->copy()->addHours($duree);

        return !static::where('repetiteur_id', $repetiteurId)
            ->where('date', $date)
            ->whereNotIn('statut', ['annulee', 'refusee'])
            ->where(function($query) use ($start, $end) {
                $query->where(function($q) use ($start, $end) {
                    $q->where('heure', '>=', $start->format('H:i:s'))
                      ->where('heure', '<', $end->format('H:i:s'));
                })->orWhere(function($q) use ($start) {
                    $q->whereRaw(
                        'ADDTIME(heure, SEC_TO_TIME(duree_heures * 3600)) > ?',
                        [$start->format('H:i:s')]
                    )->where('heure', '<=', $start->format('H:i:s'));
                });
            })
            ->exists();
    }
}