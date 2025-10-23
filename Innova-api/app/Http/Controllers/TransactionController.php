<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Reservation;

use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $transactions = Transaction::with(['user', 'reservation', 'cours'])->get();
        return response()->json($transactions);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'reservation_id' => 'nullable|exists:reservations,id',
            'cours_id' => 'nullable|exists:cours,id',
            'montant' => 'required|numeric',
            'statut' => 'required|in:en_attente,complete,annulee',
            'mode_paiement' => 'required|in:stripe,mobile money,virement,paypal',
            'date_paiement' => 'nullable|date',
        ]);

        $transaction = Transaction::create($validatedData);

        return response()->json($transaction, 201);
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        return response()->json($transaction->load(['user', 'reservation', 'cours']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        return response()->json($transaction->load(['user', 'reservation', 'cours']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $validatedData = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'reservation_id' => 'sometimes|nullable|exists:reservations,id',
            'cours_id' => 'sometimes|nullable|exists:cours,id',
            'montant' => 'sometimes|numeric',
            'statut' => 'sometimes|in:en_attente,complete,annulee',
            'mode_paiement' => 'sometimes|in:stripe,mobile money,virement,paypal',
            'date_paiement' => 'sometimes|nullable|date',
        ]);
        $transaction->update($validatedData);
        return response()->json($transaction->load(['user', 'reservation', 'cours']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->json(null, 204);
    }
}
