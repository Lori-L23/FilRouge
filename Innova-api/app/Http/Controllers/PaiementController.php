<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

use Illuminate\Routing\Controller as BaseController;

class PaiementController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        
        // Applique le middleware admin seulement aux méthodes nécessaires
        $this->middleware('admin')->only([
            'allPayments', 
            'updateStatus',
            'financialReport'
        ]);
    }

    /**
     * Liste des paiements pour l'utilisateur connecté
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            $paiements = Paiement::with(['reservation', 'user'])
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $paiements
            ]);

        } catch (\Exception $e) {
            Log::error('PaiementController@index - User: '.$user->id.' - Error: '.$e->getMessage());
            return $this->errorResponse($e);
        }
    }

    /**
     * Liste complète des paiements (admin seulement)
     */
    public function allPayments()
    {
        try {
            $paiements = Paiement::with(['reservation', 'user'])
                ->latest()
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $paiements
            ]);

        } catch (\Exception $e) {
            Log::error('PaiementController@allPayments - Error: '.$e->getMessage());
            return $this->errorResponse($e);
        }
    }

    /**
     * Détails d'un paiement
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            $paiement = Paiement::with(['reservation.eleve.user', 'user'])
                        ->findOrFail($id);

            // Vérification des permissions
            if ($user->role !== 'admin' && $paiement->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $paiement
            ]);

        } catch (\Exception $e) {
            Log::error('PaiementController@show - Error: '.$e->getMessage());
            return $this->errorResponse($e, 404);
        }
    }

    /**
     * Traitement d'un nouveau paiement
     */
    public function processPayment(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'reservation_id' => [
                'required',
                'integer',
                'exists:reservations,id',
                function ($attribute, $value, $fail) {
                    $user = Auth::user();
                    if (!$user) {
                        $fail('Utilisateur non authentifié');
                        return;
                    }
    
                    $reservation = Reservation::with('eleve.user')->find($value);
                    
                    if (!$reservation) {
                        $fail('La réservation spécifiée n\'existe pas');
                        return;
                    }
    
                    if (!$reservation->eleve || !$reservation->eleve->user) {
                        $fail('Problème de structure de données: élève non associé');
                        return;
                    }
    
                    if ($reservation->eleve->user->id !== $user->id) {
                        $fail('Vous n\'êtes pas autorisé à payer cette réservation');
                    }
                }
            ],
            'montant' => [
                'required',
                'numeric',
                'min:0.5',
                'max:10000',
                function ($attribute, $value, $fail) use ($request) {
                    $reservation = Reservation::find($request->reservation_id);
                    if ($reservation && abs($value - $reservation->prix) > 0.05) {
                        $fail('Le montant doit correspondre au prix de la réservation ('.$reservation->prix.'€)');
                    }
                }
            ]
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation des données échouée',
                'errors' => $validator->errors(),
                'received_data' => $request->all()
            ], 422);
        }
    
        try {
            $user = Auth::user();
            $reservation = Reservation::with(['eleve.user', 'repetiteur.user'])
                            ->findOrFail($request->reservation_id);
    
            // Double vérification de sécurité
            if ($reservation->eleve->user->id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à payer cette réservation'
                ], 403);
            }
    
            // Configuration Stripe
            Stripe::setApiKey(config('services.stripe.secret'));
    
            $productName = 'Réservation #'.$reservation->id;
            $teacherName = optional($reservation->repetiteur)->user->name ?? 'Professeur';
    
            $sessionParams = [
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => $productName,
                            'description' => 'Cours avec '.$teacherName,
                        ],
                        'unit_amount' => (int)round($request->montant * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url').'/paiement/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.frontend_url').'/paiement/cancel',
                'metadata' => [
                    'reservation_id' => $reservation->id,
                    'user_id' => $user->id,
                    'montant' => $request->montant,
                    'eleve_id' => $reservation->eleve_id
                ],
                'customer_email' => $user->email,
            ];
    
            $session = Session::create($sessionParams);
    
            // Enregistrement en base
            $paiement = Paiement::create([
                'reservation_id' => $reservation->id,
                'user_id' => $user->id,
                'montant' => $request->montant,
                'methode' => 'stripe',
                'statut' => 'pending',
                'reference' => $session->id,
                'transaction_id' => null,
                'date_paiement' => now(),
                'eleve_id' => $reservation->eleve_id
            ]);
    
            return response()->json([
                'success' => true,
                'payment_url' => $session->url,
                'paiement_id' => $paiement->id,
                'session_id' => $session->id,
                'reservation_id' => $reservation->id
            ]);
    
        } catch (ApiErrorException $e) {
            Log::error('Stripe Error - User: '.Auth::id().' - Error: '.$e->getMessage().' - Data: '.json_encode($request->all()));
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'error_type' => 'stripe_error'
            ], 502);
        } catch (\Exception $e) {
            Log::error('Payment Process Error - User: '.Auth::id().' - Error: '.$e->getMessage().' - Data: '.json_encode($request->all()));
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'error_type' => 'server_error'
            ], 500);
        }
    }
    /**
     * Mise à jour du statut (admin seulement)
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'statut' => 'required|in:pending,completed,failed,refunded'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $paiement = Paiement::with('reservation')->findOrFail($id);
            $paiement->update(['statut' => $request->statut]);

            // Mise à jour de la réservation si paiement complété
            if ($request->statut === 'completed' && $paiement->reservation) {
                $paiement->reservation->update(['statut' => 'confirmed']);
            }

            return response()->json([
                'success' => true,
                'data' => $paiement,
                'message' => 'Statut mis à jour'
            ]);

        } catch (\Exception $e) {
            Log::error('PaiementController@updateStatus - Error: '.$e->getMessage());
            return $this->errorResponse($e);
        }
    }

    /**
     * Rapport financier (admin seulement)
     */
    public function financialReport()
    {
        try {
            $report = [
                'total_paiements' => Paiement::count(),
                'total_completed' => Paiement::where('statut', 'completed')->count(),
                'revenue' => Paiement::where('statut', 'completed')->sum('montant'),
                'last_payments' => Paiement::with('user')
                                    ->latest()
                                    ->limit(10)
                                    ->get()
            ];

            return response()->json([
                'success' => true,
                'data' => $report
            ]);

        } catch (\Exception $e) {
            Log::error('PaiementController@financialReport - Error: '.$e->getMessage());
            return $this->errorResponse($e);
        }
    }

    /**
     * Gestion centralisée des erreurs
     */
    private function errorResponse(\Exception $e, $status = 500)
    {
        return response()->json([
            'success' => false,
            'message' => 'Une erreur est survenue',
            'error' => config('app.debug') ? $e->getMessage() : null
        ], $status);
    }
}