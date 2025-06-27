<?php

namespace App\Filament\Resources\FeedbackIssues;

use App\Filament\Resources\FeedbackIssues\Pages\CreateFeedbackIssue;
use App\Filament\Resources\FeedbackIssues\Pages\EditFeedbackIssue;
use App\Filament\Resources\FeedbackIssues\Pages\ListFeedbackIssues;
use App\Filament\Resources\FeedbackIssues\Schemas\FeedbackIssueForm;
use App\Filament\Resources\FeedbackIssues\Tables\FeedbackIssuesTable;
use App\Models\FeedbackIssue;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FeedbackIssueResource extends Resource
{
    protected static ?string $model = FeedbackIssue::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return FeedbackIssueForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FeedbackIssuesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFeedbackIssues::route('/'),
            'create' => CreateFeedbackIssue::route('/create'),
            'edit' => EditFeedbackIssue::route('/{record}/edit'),
        ];
    }
}
