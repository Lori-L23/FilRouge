<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PaiementController extends Controller
{
    /**
     * Affiche la liste des paiements
     */
    public function index()
    {
        try {
            $paiements = Paiement::with(['reservation', 'user'])
                ->latest()
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $paiements
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur liste paiements: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des paiements'
            ], 500);
        }
    }

    /**
     * Affiche un paiement spécifique
     */
    public function show($id)
    {
        try {
            $paiement = Paiement::with(['reservation', 'user'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $paiement
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur détail paiement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Paiement non trouvé'
            ], 404);
        }
    }

    /**
     * Met à jour le statut d'un paiement
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:en_attente,payé,échoué,remboursé'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $paiement = Paiement::findOrFail($id);
            $paiement->update(['status' => $request->status]);

            // Si le paiement est confirmé, mettre à jour la réservation associée
            if ($request->status === 'payé' && $paiement->reservation) {
                $paiement->reservation()->update(['statut' => 'confirmé']);
            }

            return response()->json([
                'success' => true,
                'data' => $paiement,
                'message' => 'Statut mis à jour avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur mise à jour statut paiement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    /**
     * Récupère un résumé des paiements
     */
    public function summary()
    {
        try {
            $summary = [
                'total' => Paiement::count(),
                'payes' => Paiement::where('status', 'payé')->count(),
                'montant_total' => Paiement::where('status', 'payé')->sum('montant'),
                'en_attente' => Paiement::where('status', 'en_attente')->count(),
                'recentes' => Paiement::with(['user'])
                    ->latest()
                    ->limit(5)
                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur résumé paiements: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du résumé'
            ], 500);
        }
    }
}