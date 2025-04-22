<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Feedback extends Model
{ use HasFactory;

    protected $fillable = [
        'user_id',
        'repetiteur_id',
        'note',
        'commentaire',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }
}
