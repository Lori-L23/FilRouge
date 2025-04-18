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
        Schema::create('repetiteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('matieres'); // pour répétiteur
            $table->enum('niveaux', ['primaire', 'College/lycee'])->nullable(); // pour répétiteur
            $table->text('biographie'); // pour répétiteur
            $table->enum('statut_verif', ['non_verifie', 'verifie'])->default('non_verifie'); // pour répétiteur
            $table->timestamps();
            $table->integer('rayon_intervention')->default(10); // en km

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repetiteurs');
    }
};
