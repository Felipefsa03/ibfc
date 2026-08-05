<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * As senhas não são commitadas no código: use a variável de ambiente
     * SEED_ADMIN_PASSWORD. Se estiver vazia (produção), nada é criado —
     * crie os usuários manualmente ou pelo fluxo de registro.
     */
    public function run(): void
    {
        $password = env('SEED_ADMIN_PASSWORD', '');

        if ($password === '') {
            $this->command?->warn('SEED_ADMIN_PASSWORD não definida — seeder ignorado.');

            return;
        }

        $admins = [
            ['name' => 'Administrador IBFC', 'email' => 'admin@ibfc.com.br'],
            ['name' => 'Felipe Lima', 'email' => 'felipe@ibfc.com'],
            ['name' => 'Rafa Souza', 'email' => 'rafa@ibfc.com'],
            ['name' => 'Erick Melo Jr.', 'email' => 'erick@ibfc.com'],
            ['name' => 'Andrei Santos', 'email' => 'andrei@ibfc.com'],
        ];

        foreach ($admins as $admin) {
            User::firstOrCreate(
                ['email' => $admin['email']],
                ['name' => $admin['name'], 'password' => bcrypt($password)],
            );
        }
    }
}
