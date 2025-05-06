<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use App\Models\Eleve;
use App\Models\Repetiteur;
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


    
    // public function update(Request $request)
    // {
    //     $user = Auth::user();
        
    //     // Validation des données
    //     $validator = Validator::make($request->all(), [
    //         'telephone' => 'sometimes|string|max:20',
    //         'niveau_scolaire' => 'sometimes|string|max:50',
    //         'objectif' => 'sometimes|string|max:500',
    //         'biographie' => 'sometimes|string|max:1000', // Si applicable pour les répétiteurs
    //     ]);
    
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }
    
    //     try {
    //         // Si l'utilisateur est admin, il peut modifier n'importe quel profil
    //         if ($user->role === 'admin') {
    //             $targetUser = User::find($request->user_id);
    //             if (!$targetUser) {
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Utilisateur non trouvé'
    //                 ], 404);
    //             }
    //         } else {
    //             // Si l'utilisateur n'est pas admin, on met à jour son propre profil
    //             $targetUser = $user;
    //         }
    
    //         // Données à mettre à jour (selon le rôle)
    //         $profileData = array_merge(
    //             ['user_id' => $targetUser->id],
    //             $request->only(['telephone', 'niveau_scolaire', 'objectif', 'biographie'])
    //         );
    
    //         // Mise à jour du profil
    //         $profile = Profile::updateOrCreate(
    //             ['user_id' => $targetUser->id],
    //             $profileData
    //         );
    
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Profil mis à jour avec succès',
    //             'profile' => $profile
    //         ]);
    
    //     } catch (\Exception $e) {
    //         Log::error('Erreur de mise à jour du profil', [
    //             'user_id' => $user->id,
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //             'input' => $request->all()
    //         ]);
    
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur technique lors de la mise à jour',
    //             'error' => config('app.debug') ? [
    //                 'message' => $e->getMessage(),
    //                 'file' => $e->getFile(),
    //                 'line' => $e->getLine()
    //             ] : null
    //         ], 500);
    //     }
    // }
    
    

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