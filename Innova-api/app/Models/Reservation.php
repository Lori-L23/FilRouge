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
        'cours_id', // Ajout important si tu lies une réservation à un cours !
        'date_reservation',
        'statut',
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

    /**
     * Scopes
     */

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('date_reservation', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['statut'])) {
            $query->where('statut', $filters['statut']);
        }
    }

    public function scopeSort($query, array $sorts)
    {
        if (!empty($sorts['sort'])) {
            $direction = $sorts['direction'] ?? 'asc';
            $query->orderBy('date_reservation', $direction);
        }
    }

    public function scopeWithRelations($query)
    {
        return $query->with(['cours', 'eleve', 'repetiteur']);
    }
}
