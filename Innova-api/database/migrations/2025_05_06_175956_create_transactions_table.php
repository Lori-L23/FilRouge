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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reservation_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('cours_id')->constrained()->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->enum('statut', ['en_attente', 'complete', 'annulee'])->default('en_attente');
            $table->enum('mode_paiement', ['stripe', 'mobile money','virement', 'paypal']); // e.g., 'carte', 'paypal', etc.
            // $table->string('reference_transaction')->nullable(); // Référence de la transaction
            $table->dateTime('date_paiement')->nullable(); // Date de la transaction
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
