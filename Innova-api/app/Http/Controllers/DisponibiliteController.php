<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Disponibilite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Repetiteur;
use App\Models\Eleve;
use Illuminate\Support\Facades\Validator;


class DisponibiliteController extends Controller
{
  

// DisponibiliteController.php
public function index($userId)
{
    try {
        // Trouver le répétiteur associé à l'utilisateur
        $repetiteur = Repetiteur::where('user_id', $userId)->first();

        if (!$repetiteur) {
            return response()->json([
                'success' => false,
                'message' => 'Profil répétiteur non trouvé'
            ], 404);
        }

        // Récupérer les disponibilités avec le bon repetiteur_id
        $disponibilites = Disponibilite::where('repetiteur_id', $repetiteur->id)
            ->orderByRaw("FIELD(jour, 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche')")
            ->orderBy('heure_debut')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $disponibilites
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur serveur',
            'error' => $e->getMessage()
        ], 500);
    }
}

    

    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'jour' => 'required|in:lundi,mardi,mercredi,jeudi,vendredi,samedi,dimanche',
        'heure_debut' => 'required|date_format:H:i',
        'heure_fin' => 'required|date_format:H:i|after:heure_debut',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();
        
        // Vérifier si l'utilisateur a un profil répétiteur
        if (!$user->repetiteur) {
            return response()->json([
                'success' => false,
                'message' => 'Vous devez avoir un profil répétiteur pour ajouter des disponibilités'
            ], 403);
        }

        // Créer la disponibilité avec le repetiteur_id de l'utilisateur
        $disponibilite = Disponibilite::create([
            'repetiteur_id' => $user->repetiteur->id,
            'jour' => $request->jour,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin
        ]);

        return response()->json([
            'success' => true,
            'data' => $disponibilite
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création de la disponibilité'
        ], 500);
    }
}

    /**
     * Supprime une disponibilité
     * DELETE /api/disponibilites/{id}
     */
    public function destroy($id)
    {
        try {
            $disponibilite = Disponibilite::findOrFail($id);
            $disponibilite->delete();

            return response()->json([
                'success' => true,
                'message' => 'Disponibilité supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Disponibilité non trouvée ou erreur de suppression'
            ], 404);
        }
    }

 /**
     * afficher une disponibilité
     * SHOW /api/disponibilites/{id}
     */

    public function show($id)
    {

        if(!Repetiteur::where('user_id', Auth::id())->exists()){
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé. Vous devez être un répétiteur pour voir cette disponibilité.'
            ], 403);
        }
        
        try {
            $disponibilite = Disponibilite::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $disponibilite
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Disponibilité non trouvée'
            ], 404);
        }
  }
}
