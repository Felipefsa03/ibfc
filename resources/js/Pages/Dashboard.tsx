import { Head, Link } from '@inertiajs/react';
import PlayerCard from '@/Components/PlayerCard';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps, Player } from '@/types';

type DashboardProps = PageProps<{
    stats: {
        total: number;
        active: number;
        inactive: number;
        average: number;
        topPlayers: Player[];
    };
}>;

export default function Dashboard({ stats }: DashboardProps) {
    const summary = [
        {
            label: 'Total de jogadores',
            value: stats.total,
            color: 'text-slate-900 dark:text-slate-100',
        },
        {
            label: 'Ativos',
            value: stats.active,
            color: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Inativos',
            value: stats.inactive,
            color: 'text-red-500 dark:text-red-400',
        },
        {
            label: 'Overall médio',
            value: stats.average,
            color: 'text-indigo-600 dark:text-indigo-400',
        },
    ];

    return (
        <AppLayout
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {summary.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800"
                            >
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {item.label}
                                </p>
                                <p
                                    className={`mt-1 text-4xl font-extrabold ${item.color}`}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-sm sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-bold">
                                    Monte sua escalação
                                </h3>
                                <p className="mt-1 text-sm text-indigo-100">
                                    Gerencie o elenco e visualize as cartinhas
                                    dos jogadores.
                                </p>
                            </div>
                            <Link
                                href={route('players.index')}
                                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
                            >
                                Acessar Jogadores
                            </Link>
                        </div>

                        <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-sm sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-bold">
                                    Monte os times do dia
                                </h3>
                                <p className="mt-1 text-sm text-emerald-100">
                                    Crie match days e balanceie o elenco
                                    automaticamente.
                                </p>
                            </div>
                            <Link
                                href={route('matchDays.index')}
                                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow transition hover:bg-emerald-50"
                            >
                                Match Days
                            </Link>
                        </div>
                    </div>

                    {stats.topPlayers.length > 0 && (
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    Melhores jogadores
                                </h3>
                                <Link
                                    href={route('players.index')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                    Ver todos →
                                </Link>
                            </div>
                            <div className="pcard-grid">
                                {stats.topPlayers.map((player) => (
                                    <Link
                                        key={player.id}
                                        href={route('players.show', player.id)}
                                        className="nc-lift block"
                                    >
                                        <PlayerCard player={player} />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
