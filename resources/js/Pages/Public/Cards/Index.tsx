import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/Components/Icon';
import PlayerCard from '@/Components/PlayerCard';
import PublicLayout from '@/Layouts/PublicLayout';
import { positionName } from '@/lib/countries';
import type { Player } from '@/types';

type CardListing = Player & {
    total_goals: number;
    total_assists: number;
    total_games: number;
};

type IndexProps = {
    players: CardListing[];
    filters: {
        search: string;
        status: string;
        sort: string;
        direction: string;
    };
};

const STATUS_FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
];

const SORT_OPTIONS = [
    { value: 'overall', label: 'Overall' },
    { value: 'name', label: 'Nome' },
    { value: 'goals', label: 'Gols' },
    { value: 'assists', label: 'Assistências' },
    { value: 'participations', label: 'Participações' },
];

export default function Index({ players, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [sort, setSort] = useState(filters.sort);
    const [direction, setDirection] = useState(filters.direction);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;

            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('cards.index'),
                { search, status, sort, direction },
                {
                    preserveState: true,
                    replace: true,
                    only: ['players', 'filters'],
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status, sort, direction]);

    return (
        <PublicLayout>
            <Head title="Cartas" />

            <div className="stu flex flex-col gap-3">
                <div>
                    <span className="u-kicker">Temporada 26</span>
                    <h1 className="u-display mt-1 text-[31px]">Cartas</h1>
                    <p
                        className="mt-1 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Consulte a evolução de qualquer jogador do IBFC — sem
                        login.
                    </p>
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

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sort"
                            className="nc-label mb-0 shrink-0"
                        >
                            Ordenar
                        </label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="nc-input h-9 text-[11px] uppercase"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() =>
                                setDirection(
                                    direction === 'asc' ? 'desc' : 'asc',
                                )
                            }
                            aria-label={
                                direction === 'asc'
                                    ? 'Ordem crescente'
                                    : 'Ordem decrescente'
                            }
                            title={
                                direction === 'asc'
                                    ? 'Ordem crescente'
                                    : 'Ordem decrescente'
                            }
                            className="nc-btn nc-btn--quiet h-9 w-9 shrink-0 px-0"
                        >
                            <Icon
                                name={
                                    direction === 'asc'
                                        ? 'arrowUp'
                                        : 'arrowDown'
                                }
                                size={14}
                            />
                        </button>
                    </div>
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
                        Ajuste a busca ou o filtro.
                    </p>
                </div>
            ) : (
                <div className="st pcard-grid mt-4">
                    {players.map((player) => (
                        <Link
                            key={player.id}
                            href={route('cards.show', player.id)}
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
        </PublicLayout>
    );
}
