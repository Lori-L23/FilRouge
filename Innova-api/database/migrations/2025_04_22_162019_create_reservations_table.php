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
            $table->unsignedBigInteger('eleve_id');
            $table->unsignedBigInteger('repetiteur_id');
            $table->dateTime('date_reservation');
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee', 'annulee']);
            $table->unsignedBigInteger('cours_id')->nullable();
            $table->decimal('prix_total', 10, 2)->nullable();
            $table->unsignedBigInteger('transaction_id')->nullable();
            // $table->integer('duree')->nullable(); 
            $table->timestamps();
        
            $table->foreign('eleve_id')->references('id')->on('eleves')->onDelete('cascade');
            $table->foreign('repetiteur_id')->references('id')->on('repetiteurs')->onDelete('cascade');
            // $table->foreign('lieu_id')->references('id')->on('lieux')->onDelete('cascade');
            $table->foreign('cours_id')->references('id')->on('cours')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('cascade');
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
