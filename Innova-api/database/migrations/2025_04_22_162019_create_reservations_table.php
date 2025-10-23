<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->onDelete('cascade');
            $table->foreignId('repetiteur_id')->constrained('repetiteurs')->onDelete('cascade');
            $table->foreignId('cours_id')->nullable()->constrained('cours')->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained('matiere_repetiteur')->onDelete('cascade');
            
            // Informations de base
            $table->date('date');
            $table->time('heure');
            $table->decimal('duree_heures', 5, 2)->default(1.00); // Durée par défaut de 1 heure
            
            // Statut
            $table->enum('statut', [
                'en_attente', 
                'acceptee', 
                'refusee', 
                'annulee', 
                'terminee'
            ])->default('en_attente');
            
            // Paiement
            $table->decimal('prix_total', 10, 2);
            $table->enum('statut_paiement', [
                'en_attente', 
                'paye', 
                'rembourse', 
                'echec'
            ])->default('en_attente');
            
            // Autres informations
            $table->text('raison_annulation')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            // Index pour améliorer les performances
            $table->index(['date', 'heure']);
            $table->index(['statut', 'statut_paiement']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};