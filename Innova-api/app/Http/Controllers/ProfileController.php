<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();
        
        // Validation des données
        $validator = Validator::make($request->all(), [
            'telephone' => 'sometimes|string|max:20',
            'niveau_scolaire' => 'sometimes|string|max:50',
            'objectif' => 'sometimes|string|max:500'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            // Méthode ultra-fiable avec création conditionnelle
            $profileData = array_merge(
                ['user_id' => $user->id],
                $request->only(['telephone', 'niveau_scolaire', 'objectif'])
            );
    
            // Utilisation directe du modèle Profile
            $profile = Profile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
    
            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'profile' => $profile
            ]);
    
        } catch (\Exception $e) {
            Log::error('Profile update error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur technique lors de la mise à jour',
                'error' => config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }
    public function show()
    {
        $user = Auth::user();
        
        if ($user->profile) {
            return response()->json([
                'success' => true,
                'profile' => $user->profile
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Aucun profil trouvé'
            ], 404);
        }
    }
}