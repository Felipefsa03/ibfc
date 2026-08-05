import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/Components/Icon';
import PlayerCard from '@/Components/PlayerCard';
import AppLayout from '@/Layouts/AppLayout';
import { positionName } from '@/lib/countries';
import type { PageProps, Player } from '@/types';

type IndexProps = PageProps<{
    players: Player[];
    filters: { search: string; status: string };
}>;

const STATUS_FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
];

export default function Index({ players, filters }: IndexProps) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('players.index'),
                { search, status },
                {
                    preserveState: true,
                    replace: true,
                    only: ['players', 'filters'],
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status]);

    return (
        <AppLayout>
            <Head title="Elenco" />

            <div className="stu flex flex-col gap-3">
                {flash?.success && (
                    <div
                        className="nc-panel nc-panel--top px-4 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: 'var(--color-accent-200)' }}
                    >
                        {flash.success}
                    </div>
                )}

                <div className="flex items-end justify-between gap-4">
                    <div>
                        <span className="u-kicker">Temporada 26</span>
                        <h1 className="u-display mt-1 text-[31px]">Elenco</h1>
                    </div>

                    <Link
                        href={route('players.create')}
                        className="nc-btn nc-btn--sm"
                    >
                        <Icon name="plus" size={13} /> Novo
                    </Link>
                </div>

                <div className="relative">
                    <Icon
                        name="search"
                        size={14}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                        style={{ color: 'var(--color-neutral-500)' }}
                    />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nome ou apelido"
                        aria-label="Buscar jogador por nome ou apelido"
                        className="nc-input pl-9 text-[11px] tracking-[0.1em] uppercase"
                    />
                </div>

                <div
                    className="nc-tabs"
                    role="group"
                    aria-label="Filtrar por status"
                >
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => setStatus(filter.value)}
                            aria-pressed={status === filter.value}
                            className={
                                status === filter.value
                                    ? 'nc-tab is-on'
                                    : 'nc-tab'
                            }
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {players.length === 0 ? (
                <div
                    className="mt-7 px-5 py-10 text-center"
                    style={{ border: '1px dashed var(--color-neutral-800)' }}
                >
                    <p className="u-display text-[17px]">
                        Nenhum jogador encontrado
                    </p>
                    <p
                        className="mt-1.5 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Ajuste a busca ou cadastre um novo jogador.
                    </p>
                    <Link
                        href={route('players.create')}
                        className="nc-btn nc-btn--sm mt-5"
                    >
                        <Icon name="plus" size={13} /> Cadastrar jogador
                    </Link>
                </div>
            ) : (
                <div className="st pcard-grid mt-4">
                    {players.map((player) => (
                        <Link
                            key={player.id}
                            href={route('players.show', player.id)}
                            className="nc-lift block"
                        >
                            <PlayerCard player={player} />

                            <div className="mt-1.5 flex items-center justify-between gap-2">
                                <span className="u-meta truncate">
                                    {positionName(player.position)}
                                </span>
                                <span
                                    className="u-meta shrink-0"
                                    style={{
                                        color: player.active
                                            ? 'var(--color-accent-300)'
                                            : 'var(--color-neutral-600)',
                                    }}
                                >
                                    {player.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
