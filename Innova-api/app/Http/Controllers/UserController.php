<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::with(['eleve', 'repetiteur', 'admin'])->findOrFail($id);
        
        return response()->json([
            'user' => $user,
            'profile' => $user->{$user->role} // Retourne la relation correspondante
        ]);
    }


    public function getRepetiteurs(Request $request)
    {
        // Valider les paramètres de requête
        $validated = $request->validate([
            'matiere_id' => 'nullable|integer|exists:matieres,id',
            'niveau' => 'nullable|in:primaire,college/lycee',
            'search' => 'nullable|string|max:255',
        ]);
    
        try {
            $query = User::with(['repetiteur.cours.matiere'])
                ->where('role', 'repetiteur')
                ->where('statut', 'actif');
    
            // Filtres
            if ($request->matiere_id) {
                $query->whereHas('repetiteur.cours', function($q) use ($request) {
                    $q->where('matiere_id', $request->matiere_id);
                });
            }
    
            if ($request->niveau) {
                $query->whereHas('repetiteur.cours', function($q) use ($request) {
                    $q->where('niveau_scolaire', $request->niveau);
                });
            }
    
            if ($request->search) {
                $search = '%'.$request->search.'%';
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', $search)
                      ->orWhere('prenom', 'like', $search);
                });
            }
    
            $repetiteurs = $query->paginate(10);
    
            return response()->json([
                'success' => true,
                'data' => $repetiteurs
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
