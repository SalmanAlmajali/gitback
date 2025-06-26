<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Auth\Pages\EditProfile as FilamentEditProfile;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EditProfile extends FilamentEditProfile
{
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getNameFormComponent(),
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getPasswordConfirmationFormComponent(),
                $this->getCurrentPasswordFormComponent(),

                Section::make('Github')
                    ->description('Masukkan Personal Access Token (PAT) GitHub Anda untuk mengakses fitur integrasi GitHub.')
                    ->schema([
                        TextInput::make('github_token')
                            ->label('GitHub Personal Access Token')
                            ->password()
                            ->helperText('Token ini disimpan secara terenkripsi dan digunakan untuk integrasi GitHub.')
                            ->maxLength(255)
                            ->dehydrateStateUsing(fn($state) => $state) // biar tetap disimpan meskipun password field
                            ->autocomplete(false)
                            ->required(), // hanya wajib jika belum pernah isi
                    ]),
            ]);
    }
}
