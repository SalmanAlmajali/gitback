<?php

namespace App\Filament\Resources\Repositories\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RepositoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->label('Nama Repositori'),
                TextInput::make('github_owner')
                    ->required()
                    ->label('GitHub Owner (username/org)'),
                TextInput::make('github_repo')
                    ->required()
                    ->label('GitHub Repository (nama repositori)'),
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->label('Pemilik (User)')
                    ->searchable()
                    ->preload()
                    ->placeholder('Pilih Pemilik Repositori'),
            ]);
    }
}
