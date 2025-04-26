<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'telephone', 
        'niveau_scolaire',
        'objectif'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
