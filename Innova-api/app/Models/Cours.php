<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Cours extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'matiere_id',
        'repetiteur_id',
        'niveau_scolaire',
        'tarif_horaire',
    ];

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function repetiteur()
    {
        return $this->belongsTo(Repetiteur::class);
    }
    public function categories()
{
    return $this->belongsToMany(Category::class, 'course_category');
}
}
