<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    protected $fillable = [

        'user_id',
        'type',
        'nom',
        'adresse',


    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class);
    }
    
    

}
