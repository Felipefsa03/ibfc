import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import Icon from '@/Components/Icon';
import StarRating from '@/Components/StarRating';
import AppLayout from '@/Layouts/AppLayout';
import { cardRarity } from '@/lib/cards';
import { positionName } from '@/lib/countries';
import { formatDateLong } from '@/lib/dates';
import {
    EMPTY_PERFORMANCE,
    PARTICIPATION_PENALTY,
    POINTS_PER_ASSIST,
    POINTS_PER_DECISIVE_PASS,
    POINTS_PER_GOAL,
    POINTS_PER_STAR,
    formatDelta,
    otherAttributeDelta,
    passAttackDelta,
} from '@/lib/progression';
import type { PerformanceEntry } from '@/lib/progression';
import type { MatchDay, PageProps, Player } from '@/types';

type Participant = {
    player: Player;
    team_name: string;
    stat: PerformanceEntry | null;
};

type FinalizeProps = PageProps<{
    matchDay: MatchDay;
    participants: Participant[];
}>;

type StatEntry = PerformanceEntry & { player_id: number };

const COUNTERS: { key: keyof PerformanceEntry; label: string; max: number }[] =
    [
        { key: 'goals', label: 'Gols', max: 99 },
        { key: 'assists', label: 'Assist.', max: 99 },
        { key: 'decisive_passes', label: 'Passes', max: 999 },
    ];

export default function Finalize({ matchDay, participants }: FinalizeProps) {
    const form = useForm<{ stats: StatEntry[] }>({
        stats: participants.map((participant) => ({
            player_id: participant.player.id,
            ...(participant.stat ?? EMPTY_PERFORMANCE),
        })),
    });

    const errors = form.errors as unknown as Record<string, string | undefined>;

    const update = (
        index: number,
        key: keyof PerformanceEntry,
        value: number,
    ) => {
        form.setData(
            'stats',
            form.data.stats.map((entry, position) =>
                position === index ? { ...entry, [key]: value } : entry,
            ),
        );
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        form.post(route('matchDays.finalize.store', matchDay.id));
    };

    return (
        <AppLayout>
            <Head title={`Finalizar · ${formatDateLong(matchDay.date)}`} />

            <div className="stu flex flex-col gap-3">
                <Link
                    href={route('matchDays.show', matchDay.id)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-neutral-400)' }}
                >
                    <Icon name="caretLeft" size={12} /> Match day
                </Link>

                <div>
                    <span className="u-kicker">Etapa de pós-jogo</span>
                    <h1 className="u-display mt-1 text-[31px] capitalize">
                        Finalizar {formatDateLong(matchDay.date)}
                    </h1>
                </div>

                <div className="nc-panel nc-panel--top p-3.5">
                    <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: 'var(--color-neutral-400)' }}
                    >
                        Ao finalizar, cada convocado paga{' '}
                        <b style={{ color: '#ffd9e0' }}>
                            −{PARTICIPATION_PENALTY}
                        </b>{' '}
                        em passe (PAS) e ataque (SHO), e recupera pontos pelo
                        que produziu: <b>+{POINTS_PER_GOAL}</b> por gol,{' '}
                        <b>+{POINTS_PER_ASSIST}</b> por assistência e{' '}
                        <b>+{POINTS_PER_DECISIVE_PASS}</b> por passe decisivo.
                        Cada estrela soma <b>+{POINTS_PER_STAR}</b> em{' '}
                        <b>todos</b> os atributos. O overall é recalculado pela
                        regra do sistema. Esta ação é definitiva.
                    </p>
                </div>

                {errors.stats && (
                    <div
                        className="nc-panel nc-panel--top px-4 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: '#ffd9e0' }}
                    >
                        {errors.stats}
                    </div>
                )}
            </div>

            <form onSubmit={submit} className="mt-5">
                <div className="grid gap-2.5 xl:grid-cols-2">
                    {participants.map((participant, index) => {
                        const entry = form.data.stats[index];

                        if (!entry) {
                            return null;
                        }

                        const player = participant.player;
                        const delta = passAttackDelta(entry);
                        const otherDelta = otherAttributeDelta(entry);

                        return (
                            <div
                                key={player.id}
                                className="nc-panel flex flex-col gap-3 p-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="nc-hex shrink-0"
                                        style={{
                                            width: 34,
                                            height: 38,
                                            fontSize: 13,
                                        }}
                                    >
                                        {player.current_overall}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="u-display truncate text-[16px]">
                                            {player.nickname || player.name}
                                        </div>
                                        <div className="u-meta truncate">
                                            {positionName(player.position)} ·{' '}
                                            {participant.team_name} ·{' '}
                                            {cardRarity(player.current_overall)}
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div className="u-meta leading-none">
                                            PAS / SHO
                                        </div>
                                        <div
                                            className="u-display mt-0.5 text-[17px] leading-none"
                                            style={{
                                                color:
                                                    delta > 0
                                                        ? 'var(--color-accent-200)'
                                                        : delta < 0
                                                          ? '#ffb3c1'
                                                          : 'var(--color-neutral-500)',
                                            }}
                                        >
                                            {formatDelta(delta)}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {COUNTERS.map((counter) => {
                                        const fieldId = `${counter.key}-${player.id}`;
                                        const errorKey = `stats.${index}.${counter.key}`;

                                        return (
                                            <div key={counter.key}>
                                                <label
                                                    htmlFor={fieldId}
                                                    className="nc-label"
                                                >
                                                    {counter.label}
                                                </label>
                                                <input
                                                    id={fieldId}
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={0}
                                                    max={counter.max}
                                                    value={entry[counter.key]}
                                                    onChange={(event) =>
                                                        update(
                                                            index,
                                                            counter.key,
                                                            Math.max(
                                                                0,
                                                                Number(
                                                                    event.target
                                                                        .value,
                                                                ) || 0,
                                                            ),
                                                        )
                                                    }
                                                    className="nc-input h-9 text-center"
                                                />
                                                {errors[errorKey] && (
                                                    <p
                                                        className="mt-1 text-[10px]"
                                                        style={{
                                                            color: '#ffb3c1',
                                                        }}
                                                    >
                                                        {errors[errorKey]}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="nc-label mb-0">
                                            Estrelas
                                        </span>
                                        <StarRating
                                            value={entry.stars}
                                            onChange={(value) =>
                                                update(index, 'stars', value)
                                            }
                                            label={`Estrelas de ${player.nickname || player.name}`}
                                        />
                                    </div>

                                    <span
                                        className="u-meta"
                                        style={{
                                            color:
                                                otherDelta > 0
                                                    ? 'var(--color-accent-300)'
                                                    : 'var(--color-neutral-600)',
                                        }}
                                    >
                                        Demais atributos{' '}
                                        {formatDelta(otherDelta)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="nc-btn"
                    >
                        <Icon name="check" size={15} />
                        {form.processing
                            ? 'Finalizando…'
                            : `Finalizar e recalcular ${participants.length} jogadores`}
                    </button>

                    <Link
                        href={route('matchDays.show', matchDay.id)}
                        className="nc-btn nc-btn--quiet"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </AppLayout>
    );
}
