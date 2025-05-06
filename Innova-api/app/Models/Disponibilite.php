<?php

namespace App\Models;



use Illuminate\Database\Eloquent\Model;
use App\Models\Repetiteur;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Disponibilite extends Model
{
    use HasFactory;
    protected $fillable = [
        'repetiteur_id',
        'jour',
        'heure_debut',
        'heure_fin',
    ];

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }
}
