<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Cours;
use App\Models\Eleve;
use App\Http\Middleware\CheckRole;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
        $this->middleware(CheckRole::class . ':eleve')->only(['store']);
    }
    /**
     * Lister toutes les réservations.
     */
    public function index()
    {
        try {
            $reservations = Reservation::with(['eleve.user', 'repetiteur.user'])->get();
            return response()->json([
                'success' => true,
                'data' => $reservations
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur liste réservations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des réservations'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cours_id' => 'required|exists:cours,id',
            'date' => 'required|date|after_or_equal:today',
            'heure' => 'required|date_format:H:i',
            'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            $user = Auth::user();
            $eleve = Eleve::where('user_id', $user->id)->first();
    
            if (!$eleve) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil élève non trouvé'
                ], 403);
            }
    
            $cours = Cours::findOrFail($request->cours_id);
    
            $reservation = Reservation::create([
                'eleve_id' => $eleve->id,
                'repetiteur_id' => $cours->repetiteur_id,
                'date_reservation' => $request->date . ' ' . $request->heure,
                'statut' => $request->statut ?? 'en_attente', // Correction ici
            ]);
    
            return response()->json([
                'success' => true,
                'data' => $reservation->load(['eleve.user', 'repetiteur.user']),
                'message' => 'Réservation créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur création réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création: ' . (env('APP_DEBUG') ? $e->getMessage() : ''),
                'error' => env('APP_DEBUG') ? $e->getTrace() : null
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $reservation = Reservation::with(['eleve.user', 'repetiteur.user'])->find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $reservation
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur affichage réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération'
            ], 500);
        }
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

        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date',
            'heure' => 'sometimes|date_format:H:i',
            'statut' => 'sometimes|in:en_attente,acceptee,refusee,annulee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];

            if ($request->has('date') && $request->has('heure')) {
                $updateData['date_reservation'] = $request->date . ' ' . $request->heure;
            } elseif ($request->has('date')) {
                // Garder l'heure existante
                $existingTime = date('H:i', strtotime($reservation->date_reservation));
                $updateData['date_reservation'] = $request->date . ' ' . $existingTime;
            } elseif ($request->has('heure')) {
                // Garder la date existante
                $existingDate = date('Y-m-d', strtotime($reservation->date_reservation));
                $updateData['date_reservation'] = $existingDate . ' ' . $request->heure;
            }

            if ($request->has('statut')) {
                $updateData['statut'] = $request->statut;
            }

            $reservation->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Réservation mise à jour.',
                'data' => $reservation->fresh(['eleve', 'repetiteur'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Supprimer une réservation.
     */
    public function destroy($id)
    {
        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée.'
                ], 404);
            }

            $reservation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Réservation supprimée avec succès.'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur suppression réservation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Mettre à jour uniquement le statut d'une réservation.
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:en_attente,acceptee,refusee,annulee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reservation = Reservation::find($id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Réservation non trouvée.'
                ], 404);
            }

            $reservation->update(['statut' => $request->statut]);

            return response()->json([
                'success' => true,
                'message' => 'Statut de la réservation mis à jour.',
                'data' => $reservation->fresh(['eleve', 'repetiteur'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour statut: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }
}
