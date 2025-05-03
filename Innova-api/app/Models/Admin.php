<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\User;

class Admin extends Model
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'user_id',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
