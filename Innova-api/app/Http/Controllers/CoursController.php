<?php
namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CoursController extends Controller
{
    public function index()
    {
        return response()->json(Cours::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'matiere_id' => 'required|exists:matieres,id',
        ]);

        // Récupérer l'utilisateur connecté via Sanctum
        $user = \Illuminate\Support\Facades\Auth::user();
        // Accéder au répétiteur via la relation définie dans User
        $repetiteur = $user->repetiteur;

        if (!$repetiteur) {
            return response()->json(['message' => 'Seuls les répétiteurs peuvent créer des cours.'], 403);
        }

        // Créer le cours
        $cours = $repetiteur->cours()->create([
            'titre' => $request->titre,
            'description' => $request->description,
            'matiere_id' => $request->matiere_id,
        ]);

        return response()->json($cours, 201);
    }
    public function show($id)
    {
        try {
            // Recherche du cours avec l'id spécifié
            $cours = Cours::findOrFail($id);
            
            // Retourner la réponse en JSON si le cours est trouvé
            return response()->json($cours);
        } catch (ModelNotFoundException $e) {
            // Si le cours n'est pas trouvé, renvoyer une erreur 404
            return response()->json(['error' => 'Cours not found'], 404);
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
