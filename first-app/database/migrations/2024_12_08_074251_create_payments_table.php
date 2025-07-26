<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained(table: 'tickets')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade')->onUpdate('cascade');
            $table->dateTime('payment_date');
            $table->string('price', 100);
            $table->enum('status', ['Pending', 'Success']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
