<?php

namespace App\Filament\Resources\FeedbackIssues\Pages;

use App\Filament\Resources\FeedbackIssues\FeedbackIssueResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFeedbackIssues extends ListRecords
{
    protected static string $resource = FeedbackIssueResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
