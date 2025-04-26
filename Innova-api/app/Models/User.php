<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'role',
        'statut', //actif ou inactif. inactif par defaut pour les repetiteurs
        'date_naissance',
        'niveau_scolaire',
        'matieres',
        'niveaux',
        'biographie',
        'photo',
        'tarif',

    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'matieres' => 'array',
            'niveaux' => 'array',
            'date_naissance' => 'date',
            'password' => 'hashed',
        ];
    }

    public function eleve()
{
    return $this->hasOne(Eleve::class);
}

public function repetiteur()
{
    return $this->hasOne(Repetiteur::class);
}
public function paiements()
{
    return $this->hasMany(Paiement::class);
}

}
