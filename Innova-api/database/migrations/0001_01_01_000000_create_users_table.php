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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone')->unique();
            $table->enum('role', ['eleve', 'repetiteur'])->default('eleve');
            // $table->string('niveau_scolaire')->nullable(); // pour élève
            // $table->json('matieres')->nullable(); // pour répétiteur
            // $table->json('niveaux')->nullable(); // pour répétiteur
            // $table->text('biographie')->nullable(); // pour répétiteur
            $table->string('email')->unique();
            $table->string('password');
            $table->point('position')->nullable(); // Pour la géolocalisation
            // $table->enum('statut_verif', ['non_verifie', 'verifie'])->default('non_verifie'); // pour répétiteur
            $table->enum('statut', ['actif', 'inactif'])->default('inactif'); // pour élève et répétiteur
            $table->spatialIndex('position');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
