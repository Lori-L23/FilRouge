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
        // Schema::create('repetiteurs', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('user_id')->constrained()->onDelete('cascade');
        //     $table->json('matieres'); // pour répétiteur
        //     $table->enum('niveaux', ['primaire', 'College/lycee'])->nullable(); // pour répétiteur
        //     $table->text('biographie'); // pour répétiteur
        //     $table->enum('statut_verif', ['non_verifie', 'verifie'])->default('non_verifie'); // pour répétiteur
        //     $table->timestamps();
        //     $table->integer('rayon_intervention')->default(10); // en km
        //     $table->string('photo')->nullable();


        // });

        Schema::create('repetiteurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matieres')->constrained()->onDelete('cascade'); // Ajouté pour la relation avec les matières
            $table->json('niveaux'); // Changé de enum à json pour stocker multiple
            $table->text('biographie');
            $table->enum('statut_verif', ['non_verifie', 'verifie'])->default('non_verifie');
            $table->integer('tarif_horaire')->nullable(); 
            $table->integer('rayon_intervention')->default(10);
            $table->string('photo')->nullable();
            $table->timestamps();
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
