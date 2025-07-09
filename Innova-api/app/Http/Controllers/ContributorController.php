<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contributor;
use Illuminate\Support\Facades\Validator;

class ContributorController extends Controller
{
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'required|string|max:255',
        'motivation' => 'required|string|min:50|max:2000',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    $contributor = Contributor::create($validator->validated());

    return response()->json([
        'success' => true,
        'message' => 'Votre candidature a été soumise avec succès!',
        'data' => $contributor
    ]);
}
}
