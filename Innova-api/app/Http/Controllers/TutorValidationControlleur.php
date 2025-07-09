<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client;

use Exception;

class TutorValidationControlleur extends Controller
{
public function validateWithAI(Request $request)
    {
        $validated = $request->validate([
            'biographie' => 'required|string|min:50',
            'questionnaire' => 'required|array',
            'matieres' => 'required|array',
            'niveau_principal' => 'required|string',
            'tarif_horaire' => 'required|numeric'
        ]);

        try {
            // 1. Construction du prompt
            $prompt = $this->buildAIPrompt($validated);
            
            // 2. Configuration de la requête
            $apiKey = env('GEMINI_API_KEY'); // À mettre dans votre .env
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=".$apiKey;
            
            $requestBody = [
                'contents' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ];
            
            // 3. Envoi de la requête
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            // 4. Traitement de la réponse
            $responseData = json_decode($response, true);
            
            $content = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;
            
            if (!$content) {
                throw new Exception("Aucune réponse valide de l'API");
            }
            
            $result = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Réponse JSON invalide: " . $content);
            }
            
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'score' => 5,
                'feedback' => ['Erreur de traitement: ' . $e->getMessage()],
                'is_valid' => false
            ], 500);
        }
    }
    private function buildAIPrompt(array $data): string
    {
        return "En tant qu'expert en évaluation pédagogique, analyse ce profil de tuteur:\n\n" .
               "**Biographie:**\n{$data['biographie']}\n\n" .
               "**Matières enseignées:** " . implode(', ', $data['matieres']) . "\n" .
               "**Niveau principal:** {$data['niveau_principal']}\n" .
               "**Tarif horaire:** {$data['tarif_horaire']} FCFA\n" .
               "**Réponses au questionnaire:**\n" . json_encode($data['questionnaire'], JSON_PRETTY_PRINT) . "\n\n" .
               "Fournis une évaluation JSON avec:\n" .
               "- score (0-10)\n" .
               "- feedback (liste de points forts/faibles)\n" .
               "- is_valid (true si score ≥7)\n\n" .
               "Format de réponse attendu:\n" .
               "{\"score\": number, \"feedback\": string[], \"is_valid\": boolean}";
    }
}