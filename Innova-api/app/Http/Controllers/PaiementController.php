<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paiement;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::with('reservation')->get();
        return response()->json($paiements);
    }

    /**
     * Enregistre un nouveau paiement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'montant' => 'required|numeric|min:0',
            'methode' => 'required|in:stripe,orange_money,mobile_money',
            'statut' => 'required|in:pending,completed,failed,refunded',
            'transaction_id' => 'required|unique:paiements,transaction_id',
        ]);

        $paiement = Paiement::create($validated);

        return response()->json([
            'message' => 'Paiement enregistré avec succès',
            'paiement' => $paiement
        ], 201);
    }

    /**
     * Affiche un paiement spécifique.
     */
    public function show($id)
    {
        $paiement = Paiement::with('reservation')->findOrFail($id);
        return response()->json($paiement);
    }

    /**
     * Met à jour un paiement.
     */
    public function update(Request $request, $id)
    {
        $paiement = Paiement::findOrFail($id);

        $validated = $request->validate([
            'montant' => 'sometimes|numeric|min:0',
            'methode' => 'sometimes|in:stripe,orange_money,mobile_money',
            'statut' => 'sometimes|in:pending,completed,failed,refunded',
            'transaction_id' => 'sometimes|unique:paiements,transaction_id,' . $paiement->id,
        ]);

        $paiement->update($validated);

        return response()->json([
            'message' => 'Paiement mis à jour avec succès',
            'paiement' => $paiement
        ]);
    }

    /**
     * Supprime un paiement.
     */
    public function destroy($id)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->delete();

        return response()->json(['message' => 'Paiement supprimé avec succès']);
    }
    // public function scopeFilterByPeriod($query, $period)
    // {
    //     return $query->when(isset($period['start_date']), function ($q) use ($period) {
    //         $q->whereBetween('created_at', [
    //             Carbon::parse($period['start_date'])->startOfDay(),
    //             Carbon::parse($period['end_date'])->endOfDay()
    //         ]);
    //     });
    // }
}
