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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seat_id')->constrained(table: 'seats')->onDelete('cascade');
            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade');
            $table->foreignId('movie_id')->constrained(table: 'movies')->onDelete('cascade');
            $table->string('code_ticket', 100);
            $table->date('purchase_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};