<?php

namespace App\Filament\Resources\FeedbackIssues\Pages;

use App\Filament\Resources\FeedbackIssues\FeedbackIssueResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFeedbackIssue extends EditRecord
{
    protected static string $resource = FeedbackIssueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
