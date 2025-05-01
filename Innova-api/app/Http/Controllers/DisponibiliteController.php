<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Disponibilite;
use Illuminate\Support\Facades\Validator;


class DisponibiliteController extends Controller
{
    /**
     * Récupère les disponibilités d'un répétiteur
     * GET /api/repetiteurs/{id}/disponibilites
     */
    public function index($repetiteurId)
    {
        try {
            $disponibilites = Disponibilite::where('repetiteur_id', $repetiteurId)
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
                'message' => 'Erreur lors de la récupération des disponibilités'
            ], 500);
        }
    }

    /**
     * Ajoute une nouvelle disponibilité
     * POST /api/disponibilites
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'repetiteur_id' => 'required|exists:repetiteurs,id',
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
            $disponibilite = Disponibilite::create($request->all());

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
}
