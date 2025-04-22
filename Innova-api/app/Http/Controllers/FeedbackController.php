<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use App\Models\User;

class FeedbackController extends Controller
{
    /**
     * Afficher tous les feedbacks (optionnellement filtrés par répétiteur).
     */
    public function index(Request $request)
    {
        $query = Feedback::with('user'); // jointure avec le modèle User

        if ($request->has('repetiteur_id')) {
            $query->where('repetiteur_id', $request->repetiteur_id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Enregistrer un nouveau feedback.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:1000',
            'repetiteur_id' => 'required|exists:repetiteurs,id',
        ]);
    
        // $validated['user_id'] = auth()->id(); // on ajoute l'utilisateur connecté
    
        $feedback = Feedback::create($validated);
    
        return response()->json([
            'message' => 'Feedback enregistré avec succès.',
            'feedback' => $feedback,
        ], 201);
    }
    

    /**
     * Afficher un feedback spécifique.
     */
    public function show($id)
    {
        $feedback = Feedback::with('user')->findOrFail($id);
        return response()->json($feedback);
    }
}
