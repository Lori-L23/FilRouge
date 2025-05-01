<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Log; 


class MatiereController extends Controller
{
    /**
     * Récupère toutes les matières avec leurs statistiques
     */
    
    public function index()
{
    try {
        $matieres = Matiere::all();
        // Récupérer le nombre de professeurs pour chaque matière
        foreach ($matieres as $matiere) {
            $matiere->professeurs_count = User::whereHas('repetiteur.cours', function($query) use ($matiere) {
                $query->where('matiere_id', $matiere->id);
            })->count();
        }
        
        return response()->json([
            'success' => true,
            'data' => $matieres
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération des matières'
        ], 500);
    }
}

    /**
     * Recherche de professeurs avec filtres
     */
    public function searchRep(Request $request)
    {
        try {
            // Validation des paramètres
            $validated = $request->validate([
                'matiere_id' => 'nullable|integer|exists:matieres,id',
                'niveau' => 'nullable|in:primaire,college/lycee',
                'search' => 'nullable|string|max:255',
                'page' => 'nullable|integer|min:1'
            ]);
    
            // Construction de la requête
            $query = User::with(['repetiteur.cours.matiere'])
                ->where('role', 'repetiteur')
                ->where('statut', 'actif');
    
            // Filtre par matière
            if ($request->matiere_id) {
                $query->whereHas('repetiteur.cours', function($q) use ($request) {
                    $q->where('matiere_id', $request->matiere_id);
                });
            }
    
            // Filtre par niveau
            if ($request->niveau) {
                $query->whereHas('repetiteur.cours', function($q) use ($request) {
                    $q->where('niveau_scolaire', $request->niveau);
                });
            }
    
            // Filtre par recherche texte
            if ($request->search) {
                $search = '%'.$request->search.'%';
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', $search)
                      ->orWhere('prenom', 'like', $search)
                      ->orWhereHas('repetiteur.cours.matiere', function($q) use ($search) {
                          $q->where('nom', 'like', $search);
                      });
                });
            }
    
            // Pagination
            $professeurs = $query->paginate(10, ['*'], 'page', $request->page ?? 1);
    
            return response()->json([
                'success' => true,
                'data' => $professeurs->items(),
                'pagination' => [
                    'current_page' => $professeurs->currentPage(),
                    'total' => $professeurs->total(),
                    'per_page' => $professeurs->perPage(),
                    'last_page' => $professeurs->lastPage()
                ]
            ]);
    
        } catch (\Exception $e) {
            Log::error('Erreur recherche professeurs: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }
   public function publicList()
    {
        try {
            $matieres = Matiere::all();

            return response()->json([
                'success' => true,
                'matieres' => $matieres
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Récupère une matière par son ID
     */
    public function show($id)
    {
        try {
            $matiere = Matiere::findOrFail($id);

            return response()->json([
                'success' => true,
                'matiere' => $matiere
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la matière',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}