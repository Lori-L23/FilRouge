<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;
use Illuminate\Support\Facades\Log;
use App\Models\Contact;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:Élève/Parent,Répétiteur',
            'subject' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Enregistrement dans la base de données
            // $contact = Contact::create($request->all());
              $contact = Contact::create($validator->validated());

            // Envoi de l'email
            // Mail::to('InnovaLearn@gmail.com')->send(
            //     new ContactFormSubmitted($contact)
            // );

            return response()->json([
                'success' => true,
                'message' => 'Message envoyé avec succès!',
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            Log::error('Contact form error: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: '.$e->getMessage()
            ], 500);
        }
    }
}
