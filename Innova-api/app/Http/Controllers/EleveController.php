<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Vérifie que l'utilisateur a le droit d'accéder à ces données
        $eleve = Eleve::where('user_id', $id)->firstOrFail();
    
    return response()->json([
        'id' => $eleve->id,
        'user_id' => $eleve->user_id,
        'niveau_scolaire' => $eleve->niveau_scolaire,
        'date_naissance' => $eleve->date_naissance,
            
        ]);
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
    public function destroy(Eleve $eleve)
    {
        //
    }
}
