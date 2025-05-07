<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Repetiteur;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class CoursController extends Controller
{
    public function index()
    {
        return response()->json(Cours::all());
    }

    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'titre' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'matiere_id' => 'required|exists:matieres,id',
    //         'niveau scolaire' => 'required',
    //         'tarif_horaire' =>'required|numeric',
    //     ]);

    //     // Récupérer l'utilisateur connecté via Sanctum
    //     $user = \Illuminate\Support\Facades\Auth::user();
    //     // Accéder au répétiteur via la relation définie dans User
    //     $repetiteur = $user->repetiteur;

    //     if (!$repetiteur) {
    //         return response()->json(['message' => 'Seuls les répétiteurs peuvent créer des cours.'], 403);
    //     }

    //     // Créer le cours
    //     $cours = $repetiteur->cours()->create([
    //         'titre' => $request->titre,
    //         'description' => $request->description,
    //         'matiere_id' => $request->matiere_id,
    //         'niveau scolaire'=> $request->niveau_scolaire,
    //         'tarif_horiare'=>$request->tarif_horaire

    //     ]);

    //     return response()->json($cours, 201);
    // }


    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'titre' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'matiere_id' => 'required|exists:matieres,id',
    //         'niveau_scolaire' => 'required|string', // Nom de champ corrigé
    //         'tarif_horaire' => 'required|numeric',  // Faute de frappe corrigée
    //     ]);

    //     $user = Auth::user();
    //     $repetiteur = $user->repetiteur;

    //     if (!$repetiteur) {
    //         return response()->json(['message' => 'Seuls les répétiteurs peuvent créer des cours.'], 403);
    //     }

    //     $cours = $repetiteur->cours()->create([
    //         'titre' => $request->titre,
    //         'description' => $request->description,
    //         'matiere_id' => $request->matiere_id,
    //         'niveau_scolaire' => $request->niveau_scolaire, // Champ corrigé
    //         'tarif_horaire' => $request->tarif_horaire     // Faute de frappe corrigée
    //     ]);

    //     return response()->json($cours, 201);
    // }


    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'matiere' => 'required|string|max:100', // Validation pour le nom de la matière
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
            'matiere' => $request->matiere, // Stockage direct du nom
            'niveau_scolaire' => $request->niveau_scolaire,
            'tarif_horaire' => $request->tarif_horaire
        ]);

        return response()->json($cours, 201);
    }

    public function show($id)
    {
        $cours = Cours::with(['matiere', 'repetiteur.user', 'disponibilites'])
            ->findOrFail($id);

        // Formater les disponibilités pour le frontend
        $formattedAvailability = $this->formatDisponibilites($cours->disponibilites);

        return response()->json([
            ...$cours->toArray(),
            'availability' => $formattedAvailability,
            'matiere_nom' => $cours->matiere->nom,
            'professeur_nom' => $cours->repetiteur->user->nom_complet,
            'tarif' => $cours->tarif_horaire . '€/h'
        ]);
    }

    private function formatDisponibilites($disponibilites) {}



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
