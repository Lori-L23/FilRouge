<?php

namespace App\Http\Controllers;

use App\Models\Repetiteur;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Matiere;
use Illuminate\Support\Facades\Validator;

class RepetiteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $repetiteurs = Repetiteur::with('user')->whereHas('user', function($query) {
            $query->where('statut', 'actif');
        })->get();

        return response()->json($repetiteurs);
    }

    // Recherche avancée
    public function search(Request $request)
    {
        $query = Repetiteur::query()->with('user');
        
        if ($request->has('matiere_id')) {
            $query->whereJsonContains('matieres', (int)$request->matiere_id);
        }
        
        if ($request->has('niveau')) {
            $query->where('niveaux', $request->niveau);
        }
        
        if ($request->has('rayon') && $request->has('latitude') && $request->has('longitude')) {
            // Implémentation géolocalisation 
        }

        $repetiteurs = $query->get();
        
        return response()->json($repetiteurs);
    }

    // Inscription professeur
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matieres' => 'required',
            'niveaux' => 'required',
            'biographie' => 'required|string',
            'rayon_intervention' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = $request->user();
        
        // Vérifier si l'utilisateur est déjà répétiteur
        if ($user->repetiteur) {
            return response()->json(['message' => 'Vous êtes déjà inscrit comme professeur'], 400);
        }

        // Créer le profil répétiteur
        $repetiteur = Repetiteur::create([
            'user_id' => $user->id,
            'matieres' => json_encode($request->matieres),
            'niveaux' => $request->niveaux,
            'biographie' => $request->biographie,
            'rayon_intervention' => $request->rayon_intervention,
            'statut_verif' => 'non_verifie'
        ]);

        // Mettre à jour le rôle de l'utilisateur
        $user->role = 'repetiteur';
        $user->save();

        return response()->json($repetiteur, 201);
    }
}