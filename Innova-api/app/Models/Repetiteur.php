<?php

namespace App\Models;

use App\Models\User;
use App\Models\Cours;
use App\Models\Disponibilite;
use App\Models\Matiere;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class Repetiteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        // 'matieres_id',
        'niveau_principal',
        'classes_college',
        'biographie',
        'statut_verif',
        'tarif_horaire',
        'rayon_intervention',
        // 'photo'
    ];

    protected $casts = [
        // 'matieres_id' => 'array',
        'classes_college' => 'array'
    ];

    // Niveaux principaux disponibles
    const NIVEAUX_PRINCIPAUX = ['primaire', 'college/lycee'];

    // Classes disponibles pour le collège/lycée
    const CLASSES_COLLEGE = [
        '6eme',
        '5eme',
        '4eme',
        '3eme',
        'seconde',
        'premiere',
        'terminale'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cours()
    {
        return $this->hasMany(Cours::class);
    }

    public function disponibilites()
    {
        return $this->hasMany(Disponibilite::class);
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'matiere_repetiteur');
    }

    /**
     * Mutateur pour classes_college - validation avant sauvegarde
     */
    public function setClassesCollegeAttribute($value)
    {
        // Si le niveau est primaire, on ignore complètement les classes
        if ($this->niveau_principal === 'primaire') {
            $this->attributes['classes_college'] = null;
            return;
        }

        // Conversion en tableau si ce n'en est pas un (pour gérer différents formats d'entrée)
        $classes = is_array($value) ? $value : (array)$value;

        // Validation pour college/lycée
        if ($this->niveau_principal === 'college/lycee') {
            // Vérification qu'au moins une classe est fournie
            if (empty($classes)) {
                throw ValidationException::withMessages([
                    'classes_college' => 'Vous devez sélectionner au moins une classe pour le niveau collège/lycée'
                ]);
            }

            // Filtrage des classes valides
            $validClasses = array_intersect($classes, self::CLASSES_COLLEGE);

            // Vérification que toutes les classes sont valides
            if (count($validClasses) !== count($classes)) {
                $invalidClasses = array_diff($classes, self::CLASSES_COLLEGE);
                throw ValidationException::withMessages([
                    'classes_college' => 'Classes invalides: ' . implode(', ', $invalidClasses)
                ]);
            }

            // Suppression des doublons et stockage
            $this->attributes['classes_college'] = json_encode(array_values(array_unique($validClasses)));
            return;
        }

        // Cas par défaut (normalement ne devrait pas se produire grâce aux validations)
        $this->attributes['classes_college'] = null;
    }
    /**
     * Accesseur pour les classes - retourne toujours un tableau
     */
    public function getClassesCollegeAttribute($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }

        return is_array($value) ? $value : [];
    }

    /**
     * Vérifie si le répétiteur enseigne une classe spécifique
     */
    public function enseigneClasse($classe)
    {
        if ($this->niveau_principal === 'primaire') {
            return $classe === 'primaire';
        }

        return in_array($classe, $this->classes_college);
    }

    /**
     * Vérifie si le répétiteur enseigne une matière spécifique
     */
    public function enseigneMatiere($matiereId)
    {
        return in_array($matiereId, $this->matieres);
    }
}
