<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Repetiteur;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CoursController extends Controller
{
    public function index()
    {
        // Récupérer tous les cours avec les relations nécessaires
        $cours = Cours::with(['matiere', 'repetiteur.user'])->get();

        // Formater les données pour le frontend
        $formattedCours = $cours->map(function ($cours) {
            return [
                'id' => $cours->id,
                'titre' => $cours->titre,
                'description' => $cours->description,
                'matiere_nom' => $cours->matiere->nom,
                'professeur_nom' => $cours->repetiteur->user->nom_complet,
                'niveau_scolaire' => $cours->niveau_scolaire,
                'tarif' => $cours->tarif_horaire . 'fcfa/h',
            ];
        });

        return response()->json($formattedCours);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'matiere_id' => 'required|string|max:100', // Validation pour le nom de la matière
            'niveau_scolaire' => 'required|string',
            'tarif_horaire' => 'required|numeric',
        ]);

        $user = Auth::user();
        $repetiteur = $user->repetiteur;

        if (!$repetiteur) {
            return response()->json(['message' => 'Seuls les répétiteurs peuvent créer des cours.'], 403);
        }

        $cours = $repetiteur->cours()->create([
            'titre' => $request->titre,
            'description' => $request->description,
            'matiere_id' => $request->matiere_id, // Stockage direct du nom
            'niveau_scolaire' => $request->niveau_scolaire,
            'tarif_horaire' => $request->tarif_horaire
        ]);

        return response()->json($cours, 201);
    }
    public function show($id)
    {
        try {
            // Charge le cours avec toutes les relations nécessaires
            $cours = Cours::with([
                'matiere',
                'repetiteur.user',
                'repetiteur.matieres' // Ajoutez cette relation si vous voulez les matières du répétiteur
            ])->findOrFail($id);

            // Formatage de la réponse
            $response = [
                'success' => true,
                'data' => [
                    'id' => $cours->id,
                    'titre' => $cours->titre,
                    'description' => $cours->description,
                    'niveau_scolaire' => $cours->niveau_scolaire,
                    'tarif_horaire' => $cours->tarif_horaire,
                    'matiere' => optional($cours->matiere, function ($matiere) {
                        return [
                            'id' => $matiere->id,
                            'nom' => $matiere->nom
                        ];
                    }),
                    'repetiteur' => optional($cours->repetiteur, function ($repetiteur) {
                        return [
                            'id' => $repetiteur->id,
                            'user' => optional($repetiteur->user, function ($user) {
                                return [
                                    'id' => $user->id,
                                    'nom' => $user->nom,
                                    'prenom' => $user->prenom
                                ];
                            }),
                            // Ajoutez les matières du répétiteur si nécessaire
                            'matieres' => $repetiteur->matieres->map(function ($matiere) {
                                return [
                                    'id' => $matiere->id,
                                    'nom' => $matiere->nom
                                ];
                            })->toArray()
                        ];
                    })
                ]
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error("Erreur dans CoursController@show: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Cours non trouvé',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 404);
        }
    }


    /**
     * Mettre à jour un cours.
     */

    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'matiere_id' => 'sometimes|required|exists:matieres,id',
        ]);

        $cours->update($validated);

        return response()->json($cours);
    }

    public function destroy($id)
    {
        $cours = Cours::findOrFail($id);
        $cours->delete();

        return response()->json(null, 204);
    }

    public function mesCours()
    {
        // Récupérer l'utilisateur connecté


        $user = \Illuminate\Support\Facades\Auth::user();
        // Accéder au répétiteur via la relation
        $repetiteur = $user->repetiteur;

        if (!$repetiteur) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Obtenir les cours du répétiteur
        $cours = $repetiteur->cours()->with('matiere')->get();
        return response()->json($cours);
    }
}
