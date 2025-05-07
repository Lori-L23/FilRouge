<?php

namespace App\Http\Controllers;

use App\Models\Lieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LieuController extends Controller
{
    public function index()
    {
        // Méthode la plus fiable pour obtenir l'ID utilisateur
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $lieux = Lieu::where('user_id', $userId)->get();
        return response()->json($lieux);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string',
            'type' => 'required|in:domicile_eleve,domicile_repetiteur,lieu_public'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $lieu = Lieu::create([
            'nom' => $request->nom,
            'adresse' => $request->adresse,
            'type' => $request->type,
            'user_id' => $userId
        ]);

        return response()->json($lieu, 201);
    }

    public function show($id)
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $lieu = Lieu::where('id', $id)
                   ->where('user_id', $userId)
                   ->first();

        if (!$lieu) {
            return response()->json(['error' => 'Lieu non trouvé'], 404);
        }
                   
        return response()->json($lieu);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $lieu = Lieu::where('id', $id)
                   ->where('user_id', $userId)
                   ->first();

        if (!$lieu) {
            return response()->json(['error' => 'Lieu non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'adresse' => 'sometimes|string',
            'type' => 'sometimes|in:domicile_eleve,domicile_repetiteur,lieu_public'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $lieu->update($request->all());
        return response()->json($lieu);
    }

    public function destroy($id)
    {
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $lieu = Lieu::where('id', $id)
                   ->where('user_id', $userId)
                   ->first();

        if (!$lieu) {
            return response()->json(['error' => 'Lieu non trouvé'], 404);
        }
                   
        $lieu->delete();
        return response()->json(['message' => 'Lieu supprimé avec succès'], 200);
    }
}