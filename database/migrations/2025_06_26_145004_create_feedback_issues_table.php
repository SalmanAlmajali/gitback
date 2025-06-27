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
        Schema::create('feedback_issues', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('repository_id')->constrained('repositories')->onDelete('cascade');
            $table->string('github_issue_number'); // nomor issue di GitHub
            $table->string('title');
            $table->enum('type', ['bug', 'feature', 'other']);
            $table->string('github_url');
            $table->boolean('synced')->default(true); // false jika terjadi error saat kirim
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_issues');
    }
};
