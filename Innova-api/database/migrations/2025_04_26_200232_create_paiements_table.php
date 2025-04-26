<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            
            // Clés étrangères
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Informations de paiement
            $table->decimal('montant', 10, 2);
            $table->string('methode', 50)->default('stripe'); // stripe, paypal, virement, etc.
            $table->string('statut', 20)->default('en_attente'); // en_attente, payé, échoué, remboursé
            $table->string('reference')->unique(); // Référence unique du paiement
            $table->string('transaction_id')->nullable(); // ID de transaction du processeur de paiement
            
            // Dates importantes
            $table->timestamp('date_paiement')->nullable();
            $table->timestamp('date_remboursement')->nullable();
            
            // Métadonnées
            $table->json('metadata')->nullable(); // Pour stocker des infos supplémentaires
            
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['statut', 'user_id']);
            $table->index(['reference', 'transaction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('paiements');
    }
};