<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Lister toutes les réservations.
     */
    public function index()
    {
        $reservations = Reservation::with(['cours', 'eleve', 'repetiteur'])->get();

        return response()->json($reservations);
    }

    /**
     * Créer une nouvelle réservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cours_id' => 'required|exists:cours,id',
            'eleve_id' => 'required|exists:eleves,id',
            'repetiteur_id' => 'required|exists:repetiteurs,id',
            'date' => 'required|date',
            'heure' => 'required',
            'statut' => 'nullable|string|in:en_attente,confirmé,annulé',
        ]);

        $reservation = Reservation::create($validated);

        return response()->json([
            'message' => 'Réservation créée avec succès.',
            'reservation' => $reservation
        ], 201);
    }

    /**
     * Afficher une réservation spécifique.
     */
    public function show($id)
    {
        $reservation = Reservation::with(['cours', 'eleve', 'repetiteur'])->find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], 404);
        }

        return response()->json($reservation);
        
    }

    /**
     * Mettre à jour une réservation.
     */
    public function update(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], 404);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'heure' => 'sometimes',
            'statut' => 'sometimes|string|in:en_attente,confirmé,annulé',
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Réservation mise à jour.',
            'reservation' => $reservation
        ]);
    }

    /**
     * Supprimer une réservation.
     */
    public function destroy($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], 404);
        }

        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée avec succès.']);
    }

    /**
     * Mettre à jour uniquement le statut d'une réservation.
     */
    public function updateStatus(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], 404);
        }

        $validated = $request->validate([
            'statut' => 'required|string|in:en_attente,confirmé,annulé',
        ]);

        $reservation->statut = $validated['statut'];
        $reservation->save();

        return response()->json([
            'message' => 'Statut de la réservation mis à jour.',
            'reservation' => $reservation
        ]);
    }
}
