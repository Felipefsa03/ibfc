import { Head, Link } from '@inertiajs/react';
import AttributeBars from '@/Components/AttributeBars';
import Icon from '@/Components/Icon';
import Pagination from '@/Components/Pagination';
import type { PaginationLink } from '@/Components/Pagination';
import PlayerCard from '@/Components/PlayerCard';
import TiltCard from '@/Components/TiltCard';
import PublicLayout from '@/Layouts/PublicLayout';
import { paceFrom } from '@/lib/cards';
import { countryName, positionName } from '@/lib/countries';
import { formatDate } from '@/lib/dates';
import type { Player } from '@/types';

type Totals = {
    games: number;
    goals: number;
    assists: number;
    decisive_passes: number;
    avg_stars: number;
    wins: number;
    draws: number;
    losses: number;
};

type HistoryRow = {
    match_day_id: number;
    date: string;
    team_name: string | null;
    opponent: string;
    result: 'win' | 'draw' | 'loss' | null;
    goals: number;
    assists: number;
    decisive_passes: number;
    stars: number;
};

type ShowProps = {
    player: Player;
    totals: Totals;
    history: {
        data: HistoryRow[];
        links: PaginationLink[];
    };
};

const RESULT_LABEL: Record<NonNullable<HistoryRow['result']>, string> = {
    win: 'Vitória',
    draw: 'Empate',
    loss: 'Derrota',
};

const RESULT_COLOR: Record<NonNullable<HistoryRow['result']>, string> = {
    win: 'var(--color-accent-300)',
    draw: 'var(--color-neutral-400)',
    loss: '#ffb3c1',
};

export default function Show({ player, totals, history }: ShowProps) {
    const stats = [
        { label: 'Jogos', value: totals.games },
        { label: 'Gols', value: totals.goals },
        { label: 'Assistências', value: totals.assists },
        { label: 'Passes decisivos', value: totals.decisive_passes },
        { label: 'Média de estrelas', value: totals.avg_stars.toFixed(1) },
        { label: 'Vitórias', value: totals.wins },
        { label: 'Empates', value: totals.draws },
        { label: 'Derrotas', value: totals.losses },
    ];

    return (
        <PublicLayout>
            <Head title={player.nickname || player.name} />

            <Link
                href={route('cards.index')}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors"
                style={{ color: 'var(--color-neutral-400)' }}
            >
                <Icon name="caretLeft" size={12} /> Cartas
            </Link>

            <div className="mt-4 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
                <div className="anim-pack flex justify-center">
                    <TiltCard>
                        <PlayerCard player={player} size="lg" />
                    </TiltCard>
                </div>

                <div className="stu flex flex-col gap-3">
                    <div>
                        <h1 className="u-display text-[30px]">
                            {player.nickname || player.name}
                        </h1>
                        {player.nickname && (
                            <p
                                className="mt-1 text-[11px]"
                                style={{ color: 'var(--color-neutral-500)' }}
                            >
                                {player.name}
                            </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="nc-tag nc-tag--accent">
                                {positionName(player.position)}
                            </span>
                            <span className="nc-tag nc-tag--outline">
                                {countryName(player.nationality)}
                            </span>
                            <span className="nc-tag nc-tag--neutral">
                                {player.club || 'Sem clube'}
                            </span>
                            <span
                                className="nc-tag nc-tag--outline"
                                style={{
                                    color: player.active
                                        ? 'var(--color-accent-200)'
                                        : 'var(--color-neutral-500)',
                                    borderColor: player.active
                                        ? 'var(--color-accent)'
                                        : 'var(--color-neutral-700)',
                                }}
                            >
                                {player.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: 'OVR base', value: player.overall_base },
                            {
                                label: 'OVR atual',
                                value: player.current_overall,
                            },
                            { label: 'Ritmo (PAC)', value: paceFrom(player) },
                        ].map((total) => (
                            <div
                                key={total.label}
                                className="p-2.5"
                                style={{
                                    background: 'rgba(35,37,50,.9)',
                                    border: '1px solid var(--color-neutral-800)',
                                    borderLeft:
                                        '2px solid var(--color-accent-600)',
                                }}
                            >
                                <div className="u-meta">{total.label}</div>
                                <div className="u-display mt-1 text-2xl">
                                    {total.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h2
                            className="u-display text-[13px]"
                            style={{
                                letterSpacing: '0.22em',
                                color: 'var(--color-neutral-400)',
                            }}
                        >
                            Atributos usados no cálculo do overall
                        </h2>

                        <div className="mt-2.5">
                            <AttributeBars player={player} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2
                    className="u-display text-[13px]"
                    style={{
                        letterSpacing: '0.22em',
                        color: 'var(--color-neutral-400)',
                    }}
                >
                    Estatísticas da temporada
                </h2>

                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="p-2.5"
                            style={{
                                background: 'rgba(35,37,50,.9)',
                                border: '1px solid var(--color-neutral-800)',
                            }}
                        >
                            <div className="u-meta">{stat.label}</div>
                            <div className="u-display mt-1 text-xl">
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between">
                    <h2
                        className="u-display text-[13px]"
                        style={{
                            letterSpacing: '0.22em',
                            color: 'var(--color-neutral-400)',
                        }}
                    >
                        Histórico de partidas
                    </h2>
                    <span
                        className="text-[10px]"
                        style={{ color: 'var(--color-neutral-600)' }}
                    >
                        Um Match Day por linha
                    </span>
                </div>

                {history.data.length === 0 ? (
                    <p
                        className="mt-3 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Nenhum Match Day finalizado ainda.
                    </p>
                ) : (
                    <div className="mt-3 flex flex-col gap-1.5">
                        {history.data.map((row) => (
                            <div
                                key={row.match_day_id}
                                className="nc-row flex-wrap gap-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="u-display text-[15px] capitalize">
                                        {formatDate(row.date)}
                                    </div>
                                    <div className="u-meta truncate">
                                        {row.team_name ?? '—'} vs.{' '}
                                        {row.opponent}
                                    </div>
                                </div>

                                {row.result && (
                                    <span
                                        className="nc-tag nc-tag--outline shrink-0"
                                        style={{
                                            color: RESULT_COLOR[row.result],
                                            borderColor:
                                                RESULT_COLOR[row.result],
                                        }}
                                    >
                                        {RESULT_LABEL[row.result]}
                                    </span>
                                )}

                                <div className="flex shrink-0 items-center gap-3 text-[11px]">
                                    <span title="Gols">
                                        <b className="u-display">{row.goals}</b>{' '}
                                        G
                                    </span>
                                    <span title="Assistências">
                                        <b className="u-display">
                                            {row.assists}
                                        </b>{' '}
                                        A
                                    </span>
                                    <span title="Passes decisivos">
                                        <b className="u-display">
                                            {row.decisive_passes}
                                        </b>{' '}
                                        P
                                    </span>
                                    <span title="Estrelas">
                                        <b className="u-display">{row.stars}</b>{' '}
                                        ★
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-3">
                    <Pagination links={history.links} only={['history']} />
                </div>
            </div>
        </PublicLayout>
    );
}
