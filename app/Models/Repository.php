<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Repository extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'github_owner',
        'github_repo',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
