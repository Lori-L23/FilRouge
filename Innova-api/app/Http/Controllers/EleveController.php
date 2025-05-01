<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eleves = Eleve::with('user')
            ->whereHas('user', function ($query) {
                $query->where('statut', 'actif');
            })
            ->get()
            ->map(function ($eleve) {
                return [
                    'id' => $eleve->id,
                    'nom' => $eleve->user->nom,
                    'prenom' => $eleve->user->prenom,
                    'email' => $eleve->user->email,
                    'niveau_scolaire' => $eleve->niveau_scolaire,
                    'objectif' => $eleve->objectif,
                ];
            });

        return response()->json($eleves);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'niveau_scolaire' => 'required|string',
            'objectif' => 'nullable|string'
        ]);

        $eleve = Eleve::create($validated);

        return response()->json($eleve, 201);
    }

    /**
     * Display the specified resource.
     */
    // App/Http/Controllers/ReservationController.php

    public function getUserReservations(Request $request, $id)
    {
        try {
            // 1. Récupérer l'utilisateur authentifié
            $user = $request->user();

            // 2. Charger les réservations avec les relations nécessaires
            $reservations = Reservation::with([
                'repetiteur.user',
                'cours.matiere',
                'eleve'
            ])
                ->where('eleve_id', $id)
                ->orderBy('date_reservation', 'desc')
                ->get();

            // 3. Formater la réponse
            return response()->json([
                'success' => true,
                'data' => $reservations->map(function ($reservation) {
                    return [
                        'id' => $reservation->id,
                        'date_reservation' => $reservation->date_reservation,
                        'statut' => $reservation->statut,
                        'prix' => $reservation->prix,
                        'repetiteur' => $reservation->repetiteur ? [
                            'id' => $reservation->repetiteur->id,
                            'nom_complet' => $reservation->repetiteur->user->prenom . ' ' . $reservation->repetiteur->user->nom,
                            'user' => $reservation->repetiteur->user
                        ] : null,
                        'matiere' => $reservation->cours->matiere ?? null,
                        'created_at' => $reservation->created_at,
                        'updated_at' => $reservation->updated_at
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des réservations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    // App/Http/Controllers/EleveController.php
    public function update(Request $request, $id)
    {
        $eleve = Eleve::where('user_id', $id)->firstOrFail();

        $validated = $request->validate([
            'niveau_scolaire' => 'required|string',
            'objectif' => 'nullable|string'
        ]);

        $eleve->update($validated);

        return response()->json($eleve);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Eleve $eleve) {}
}
