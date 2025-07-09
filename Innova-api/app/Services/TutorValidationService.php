<?php

namespace App\Services;

class TutorValidationService
{
    const MINIMUM_SCORE = 7;
    const MAX_SCORE = 10;

    public function validate(array $tutorData): array
    {
        $score = 0;
        $feedback = [];
        $details = [];

        // 1. Validation des matières (max 3 points)
        $subjectScore = $this->validateSubjects(
            $tutorData['matieres'], 
            $tutorData['niveau_principal'],
            $feedback
        );
        $score += $subjectScore;
        $details['subjects'] = $subjectScore;

        // 2. Validation de la biographie (max 2 points)
        $bioScore = $this->validateBiography(
            $tutorData['biographie'],
            $feedback
        );
        $score += $bioScore;
        $details['biography'] = $bioScore;

        // 3. Validation des classes (max 2 points)
        $classScore = $this->validateClasses(
            $tutorData['classes_college'] ?? [],
            $tutorData['niveau_principal'],
            $feedback
        );
        $score += $classScore;
        $details['classes'] = $classScore;

        // 4. Validation du tarif (max 1 point)
        $priceScore = $this->validatePrice(
            $tutorData['tarif_horaire'],
            $feedback,
            $tutorData['niveau_principal']
        );
        $score += $priceScore;
        $details['price'] = $priceScore;

        // 5. Bonus pour profil complet (max 2 points)
        $completenessScore = $this->validateCompleteness(
            $tutorData,
            $feedback
        );
        $score += $completenessScore;
        $details['completeness'] = $completenessScore;

        // Normalisation du score
        $normalizedScore = min($score, self::MAX_SCORE);

        return [
            'score' => $normalizedScore,
            'required_score' => self::MINIMUM_SCORE,
            'is_valid' => $normalizedScore >= self::MINIMUM_SCORE,
            'feedback' => $feedback,
            'score_details' => $details
        ];
    }

    private function validateSubjects(array $subjects, string $level, array &$feedback): float
    {
        $primarySubjects = [1, 4, 5]; // Maths, Français, Anglais
        $secondarySubjects = [1, 2, 3, 4, 5, 6, 7, 8]; // Toutes matières
        
        $score = 0;
        
        // Cohérence niveau/matières (1 point)
        if ($level === 'primaire') {
            $inappropriate = array_diff($subjects, $primarySubjects);
            if (empty($inappropriate)) {
                $score += 1;
            } else {
                $feedback[] = "Certaines matières ne sont pas typiques pour le niveau primaire";
            }
        } else {
            if (count(array_intersect($subjects, [1, 4])) >= 2) { // Maths et Français
                $score += 1;
            } else {
                $feedback[] = "Les matières principales (Maths/Français) sont recommandées";
            }
        }
        
        // Nombre de matières (1 point)
        $count = count($subjects);
        if ($count >= 3 && $count <= 5) {
            $score += 1;
            if ($count > 5) {
                $feedback[] = "Trop de matières peuvent diluer votre expertise";
            }
        } else {
            $feedback[] = "3-5 matières est la fourchette optimale";
        }
        
        // Combinaison stratégique (1 point)
        if ($level === 'college/lycee' && count(array_intersect($subjects, [1, 2, 3])) >= 2) {
            $score += 1; // Bonus pour matières scientifiques
        }
        
        return min($score, 3);
    }

    private function validateBiography(string $bio, array &$feedback): float
    {
        $score = 0;
        $wordCount = str_word_count($bio);
        
        // Longueur (0.5 point)
        if ($wordCount >= 100) {
            $score += 0.5;
        } else {
            $feedback[] = "Votre biographie est trop courte (minimum 100 mots recommandé)";
        }
        
        // Mots-clés (0.5 point)
        $keywords = ['expérience', 'méthode', 'pédagogie', 'diplôme', 'élèves', 'succès'];
        $found = 0;
        foreach ($keywords as $keyword) {
            if (stripos($bio, $keyword) !== false) $found++;
        }
        
        if ($found >= 3) {
            $score += 0.5;
        } else {
            $feedback[] = "Ajoutez plus de détails sur votre expérience et méthode";
        }
        
        // Structure (1 point)
        if (preg_match('/\.\s[A-Z]|•|\n/', $bio)) {
            $score += 1; // Phrases bien formées ou listes
        } else {
            $feedback[] = "Structurez votre biographie avec des paragraphes clairs";
        }
        
        return min($score, 2);
    }

    private function validateClasses(array $classes, string $level, array &$feedback): float
    {
        if ($level === 'primaire') return 2; // Pas de classes spécifiques
        
        $score = 0;
        
        // Nombre de classes (1 point)
        if (count($classes) >= 2) {
            $score += 1;
        } else {
            $feedback[] = "Sélectionnez au moins 2 classes pour mieux cibler";
        }
        
        // Classes stratégiques (1 point)
        $importantClasses = ['3eme', 'terminale'];
        if (count(array_intersect($classes, $importantClasses)) > 0) {
            $score += 1;
        } else {
            $feedback[] = "Les classes d'examens (3ème, Terminale) sont très demandées";
        }
        
        return min($score, 2);
    }
    private function validatePrice(float $price, array &$feedback, string $level): float
    {
        $avgPrices = [
            'primaire' => 3000,
            'college/lycee' => 5000
        ];
        
        
        // ±20% du prix moyen
        $min = $avgPrices[$level] * 0.8;
        $max = $avgPrices[$level] * 1.2;
        
        if ($price >= $min && $price <= $max) {
            return 1;
        }
        
        $feedback[] = sprintf(
            "Votre tarif (%.0f FCFA) est %s que la fourchette recommandée (%.0f-%.0f FCFA)",
            $price,
            $price < $min ? "inférieur" : "supérieur",
            $min,
            $max
        );
        
        return 0;
    }

    private function validateCompleteness(array $data, array &$feedback): float
    {
        $score = 0;
        
        // Photo (non implémentée ici mais pourrait rapporter 1 point)
        
        // Description détaillée (1 point)
        if (str_word_count($data['biographie']) >= 150) {
            $score += 1;
        }
        
        // Tarif renseigné (1 point)
        if (!empty($data['tarif_horaire']) && $data['tarif_horaire'] > 0) {
            $score += 1;
        }
        
        return min($score, 2);
    }
}