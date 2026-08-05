import { router, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import Icon from '@/Components/Icon';
import InputError from '@/Components/InputError';
import PlayerCard from '@/Components/PlayerCard';
import { positionName } from '@/lib/countries';
import type { MatchDay, Player, Team } from '@/types';

type TeamPanelProps = {
    matchDay: MatchDay;
    team: Team & { players: Player[]; total_overall: number };
    pool: Player[];
};

export default function TeamPanel({ matchDay, team, pool }: TeamPanelProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: team.name,
        score: team.score,
        won: team.won,
    });

    const [adding, setAdding] = useState('');

    const capacity = matchDay.players_per_team;
    const full = team.players.length >= capacity;

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route('teams.update', { matchDay: matchDay.id, team: team.id }));
    };

    const detach = (player: Player) => {
        router.delete(
            route('teams.detach', {
                matchDay: matchDay.id,
                team: team.id,
                player: player.id,
            }),
            { preserveScroll: true },
        );
    };

    const addPlayer = () => {
        if (!adding) {
            return;
        }

        router.post(
            route('teams.attach', {
                matchDay: matchDay.id,
                team: team.id,
                player: adding,
            }),
            {},
            { preserveScroll: true },
        );
        setAdding('');
    };

    const removeTeam = () => {
        if (window.confirm(`Remover o time "${team.name}"?`)) {
            router.delete(
                route('teams.destroy', {
                    matchDay: matchDay.id,
                    team: team.id,
                }),
                { preserveScroll: true },
            );
        }
    };

    return (
        <div className="nc-panel nc-panel--accent flex flex-col p-3">
            <form onSubmit={submit} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                    <input
                        aria-label={`Nome do time ${team.name}`}
                        type="text"
                        value={data.name}
                        onChange={(event) =>
                            setData('name', event.target.value)
                        }
                        className="nc-input h-8 min-w-0 flex-1 text-[11px] font-bold tracking-[0.14em] uppercase"
                    />

                    <div className="shrink-0 text-right">
                        <div className="u-meta leading-none">OVR total</div>
                        <div className="u-display mt-0.5 text-lg leading-none">
                            {team.total_overall}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        aria-label="Salvar time"
                        title="Salvar"
                        className="nc-btn nc-btn--sm h-8 px-2.5"
                    >
                        <Icon name="check" size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={removeTeam}
                        aria-label="Remover time"
                        title="Remover time"
                        className="nc-btn nc-btn--sm nc-btn--quiet nc-btn--danger h-8 px-2.5"
                    >
                        <Icon name="trash" size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <label
                        htmlFor={`score-${team.id}`}
                        className="text-[10px] font-bold tracking-[0.14em] uppercase"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Gols
                    </label>
                    <input
                        id={`score-${team.id}`}
                        type="number"
                        min={0}
                        value={data.score}
                        onChange={(event) =>
                            setData('score', Number(event.target.value))
                        }
                        className="nc-input h-8 w-16 text-center"
                    />

                    <button
                        type="button"
                        onClick={() => setData('won', !data.won)}
                        aria-pressed={data.won}
                        className={data.won ? 'nc-tab is-on h-8' : 'nc-tab h-8'}
                    >
                        Venceu
                    </button>
                </div>

                <InputError message={errors.name} />
            </form>

            <div
                className="mt-2.5 flex items-center justify-between text-[10px] font-bold tracking-[0.14em] uppercase"
                style={{ color: 'var(--color-neutral-500)' }}
            >
                <span>
                    {team.players.length} de {capacity} convocados
                </span>
                <span>IBFC</span>
            </div>

            {team.players.length === 0 ? (
                <div
                    className="mt-3 px-3 py-6 text-center"
                    style={{ border: '1px dashed var(--color-neutral-800)' }}
                >
                    <p
                        className="text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Nenhum convocado ainda.
                    </p>
                </div>
            ) : (
                <div className="pcard-grid mt-3">
                    {team.players.map((player) => (
                        <div key={player.id} className="group relative">
                            <PlayerCard player={player} />
                            <button
                                type="button"
                                onClick={() => detach(player)}
                                aria-label={`Remover ${player.nickname || player.name}`}
                                title="Remover do time"
                                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                style={{
                                    background: 'rgba(224,119,143,.15)',
                                    border: '1px solid #e0778f',
                                    color: '#ffd9e0',
                                }}
                            >
                                <Icon name="trash" size={10} />
                            </button>
                            <div className="mt-1 text-center">
                                <span className="u-meta">
                                    {positionName(player.position)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div
                className="mt-3 flex items-center gap-2 border-t pt-3"
                style={{ borderColor: 'var(--color-neutral-800)' }}
            >
                <select
                    aria-label="Convocar jogador disponível"
                    value={adding}
                    onChange={(event) => setAdding(event.target.value)}
                    className="nc-input h-8 min-w-0 flex-1 text-[11px]"
                    disabled={full || pool.length === 0}
                >
                    <option value="">
                        {full
                            ? 'Time completo'
                            : pool.length === 0
                              ? 'Nenhum disponível'
                              : 'Convocar jogador…'}
                    </option>
                    {pool.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.nickname || player.name} · OVR{' '}
                            {player.current_overall}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={addPlayer}
                    disabled={!adding}
                    className="nc-btn nc-btn--sm h-8 px-2.5"
                >
                    <Icon name="plus" size={14} />
                </button>
            </div>
        </div>
    );
}
