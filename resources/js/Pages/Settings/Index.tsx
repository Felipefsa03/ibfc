import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Settings() {
    return (
        <AppLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Configurações
                </h2>
            }
        >
            <Head title="Configurações" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Conta e segurança
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gerencie seus dados de acesso e altere sua senha no perfil.
                        </p>
                        <a
                            href={route('profile.edit')}
                            className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                        >
                            Ir para o Perfil
                        </a>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Sobre o sistema
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            IBFC Team Builder — gestão de jogadores, formação de times e
                            acompanhamento de desempenho em dias de jogo.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
