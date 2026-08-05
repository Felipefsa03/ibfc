import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import Icon from '@/Components/Icon';
import InputError from '@/Components/InputError';
import PlayerCard from '@/Components/PlayerCard';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateLong } from '@/lib/dates';
import type { MatchDay, PageProps, Player, Team } from '@/types';
import TeamPanel from './TeamPanel';

type MatchDayTeam = Team & { players: Player[]; total_overall: number };

type ShowProps = PageProps<{
    matchDay: Omit<MatchDay, 'teams'> & { teams: MatchDayTeam[] };
    pool: Player[];
}>;

function PoolCard({ name, overall }: { name: string; overall: number }) {
    return (
        <PlayerCard
            player={{
                id: 0,
                name,
                nickname: null,
                position: null,
                nationality: null,
                club: null,
                gol: 0,
                sho: 0,
                pas: 0,
                dri: 0,
                def: 0,
                phy: 0,
                overall_base: overall,
                current_overall: overall,
                active: true,
            }}
        />
    );
}

export default function Show({ matchDay, pool }: ShowProps) {
    const { flash } = usePage().props;
    const finalized = Boolean(matchDay.finalized_at);

    const addTeamForm = useForm({ name: '' });

    const createTeam: FormEventHandler = (event) => {
        event.preventDefault();
        addTeamForm.post(route('teams.store', matchDay.id), {
            preserveScroll: true,
            onSuccess: () => addTeamForm.reset(),
        });
    };

    const balance = () => {
        if (
            window.confirm(
                'Balancear o elenco substitui as escalações atuais deste match day, distribuindo todos os jogadores ativos pelos times pelo overall.\n\nContinuar?',
            )
        ) {
            router.post(
                route('matchDays.balance', matchDay.id),
                {},
                { preserveScroll: true },
            );
        }
    };

    const removeMatchDay = () => {
        if (
            window.confirm(
                `Excluir o match day de ${formatDateLong(matchDay.date)}?\n\nOs times e as convocações deste dia também serão removidos.`,
            )
        ) {
            router.delete(route('matchDays.destroy', matchDay.id));
        }
    };

    return (
        <AppLayout>
            <Head title={`Match Day · ${formatDateLong(matchDay.date)}`} />

            <div className="stu flex flex-col gap-3">
                {flash?.success && (
                    <div
                        className="nc-panel nc-panel--top px-4 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: 'var(--color-accent-200)' }}
                    >
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div
                        className="nc-panel nc-panel--top px-4 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                        style={{ color: '#ffd9e0' }}
                    >
                        {flash.error}
                    </div>
                )}

                <Link
                    href={route('matchDays.index')}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-neutral-400)' }}
                >
                    <Icon name="caretLeft" size={12} /> Match Days
                </Link>

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span className="u-kicker">Dia de jogo</span>
                        <h1 className="u-display mt-1 text-[31px] capitalize">
                            {formatDateLong(matchDay.date)}
                        </h1>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="nc-tag nc-tag--accent">
                                {matchDay.number_of_teams} times
                            </span>
                            <span className="nc-tag nc-tag--outline">
                                {matchDay.players_per_team} por time
                            </span>
                            <span className="nc-tag nc-tag--neutral">
                                {matchDay.number_of_matches}{' '}
                                {matchDay.number_of_matches === 1
                                    ? 'partida'
                                    : 'partidas'}
                            </span>
                            {finalized && (
                                <span
                                    className="nc-tag nc-tag--outline"
                                    style={{
                                        color: 'var(--color-accent-200)',
                                        borderColor: 'var(--color-accent)',
                                    }}
                                >
                                    Finalizado
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {!finalized && (
                            <>
                                <button
                                    type="button"
                                    onClick={balance}
                                    className="nc-btn nc-btn--quiet"
                                >
                                    <Icon name="ranking" size={15} /> Balancear
                                </button>
                                {matchDay.teams.length > 0 && (
                                    <Link
                                        href={route(
                                            'matchDays.finalize',
                                            matchDay.id,
                                        )}
                                        className="nc-btn"
                                    >
                                        <Icon name="check" size={15} />{' '}
                                        Finalizar
                                    </Link>
                                )}
                            </>
                        )}
                        <button
                            type="button"
                            onClick={removeMatchDay}
                            className="nc-btn nc-btn--quiet nc-btn--danger"
                        >
                            <Icon name="trash" size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {matchDay.teams.length === 0 ? (
                <div
                    className="mt-7 px-5 py-10 text-center"
                    style={{ border: '1px dashed var(--color-neutral-800)' }}
                >
                    <p className="u-display text-[17px]">
                        Nenhum time neste match day
                    </p>
                    <p
                        className="mt-1.5 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Crie um time abaixo ou use o balanceador para montar os{' '}
                        {matchDay.number_of_teams} times automaticamente.
                    </p>
                </div>
            ) : (
                <div
                    className="mt-6 grid items-start gap-4"
                    style={{
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                    }}
                >
                    {matchDay.teams.map((team) => (
                        <TeamPanel
                            key={team.id}
                            matchDay={matchDay}
                            team={team}
                            pool={pool}
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-end">
                <form
                    onSubmit={createTeam}
                    className="flex w-full max-w-xs items-center gap-2"
                >
                    <input
                        type="text"
                        value={addTeamForm.data.name}
                        onChange={(event) =>
                            addTeamForm.setData('name', event.target.value)
                        }
                        placeholder="Nome do novo time"
                        aria-label="Nome do novo time"
                        className="nc-input h-9 text-[11px] tracking-[0.1em] uppercase"
                        required
                    />
                    <button
                        type="submit"
                        disabled={addTeamForm.processing}
                        className="nc-btn h-9 shrink-0"
                    >
                        <Icon name="plus" size={15} /> Time
                    </button>
                </form>
                <InputError message={addTeamForm.errors.name} />
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
                        Disponíveis · {pool.length}
                    </h2>
                    <span
                        className="text-[10px]"
                        style={{ color: 'var(--color-neutral-600)' }}
                    >
                        Jogadores ativos fora das escalações
                    </span>
                </div>

                {pool.length === 0 ? (
                    <p
                        className="mt-2 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Todos os jogadores ativos estão convocados.
                    </p>
                ) : (
                    <div className="pcard-grid mt-3 opacity-70">
                        {pool.map((player) => (
                            <PoolCard
                                key={player.id}
                                name={player.nickname || player.name}
                                overall={player.current_overall}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
