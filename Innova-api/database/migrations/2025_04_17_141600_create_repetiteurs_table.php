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

            // $table->foreignId('matieres_id')->constrained()->onDelete('cascade');

            $table->enum('niveau_principal', ['primaire', 'college/lycee'])->default('college/lycee');
            $table->json('classes_college')->nullable();

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
