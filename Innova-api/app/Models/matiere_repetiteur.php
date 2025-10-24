<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Matiere_Repetiteur extends Model
{
    use HasFactory;

    protected $table = 'matiere_repetiteur';

    protected $fillable = [
        'repetiteur_id',
        'matiere_id'
    ];

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}