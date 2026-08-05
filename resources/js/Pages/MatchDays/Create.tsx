import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import Icon from '@/Components/Icon';
import InputError from '@/Components/InputError';
import AppLayout from '@/Layouts/AppLayout';

type MatchDayFormData = {
    date: string;
    number_of_matches: number;
    number_of_teams: number;
    players_per_team: number;
};

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm<MatchDayFormData>({
            date: new Date().toISOString().slice(0, 10),
            number_of_matches: 1,
            number_of_teams: 2,
            players_per_team: 5,
        });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('matchDays.store'));
    };

    return (
        <AppLayout>
            <Head title="Novo match day" />

            <div className="mb-4">
                <Link
                    href={route('matchDays.index')}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-neutral-400)' }}
                >
                    <Icon name="caretLeft" size={12} /> Match Days
                </Link>
                <h1 className="u-display mt-2 text-[29px]">Novo match day</h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
                <form
                    onSubmit={submit}
                    className="stu flex max-w-md flex-col gap-3.5"
                >
                    <div>
                        <label htmlFor="date" className="nc-label">
                            Data
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(event) =>
                                setData('date', event.target.value)
                            }
                            className="nc-input"
                            required
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="number_of_teams" className="nc-label">
                            Número de times
                        </label>
                        <input
                            id="number_of_teams"
                            type="number"
                            min={2}
                            max={16}
                            value={data.number_of_teams}
                            onChange={(event) =>
                                setData(
                                    'number_of_teams',
                                    Number(event.target.value),
                                )
                            }
                            className="nc-input"
                            required
                        />
                        <InputError
                            message={errors.number_of_teams}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="players_per_team" className="nc-label">
                            Jogadores por time
                        </label>
                        <input
                            id="players_per_team"
                            type="number"
                            min={1}
                            max={20}
                            value={data.players_per_team}
                            onChange={(event) =>
                                setData(
                                    'players_per_team',
                                    Number(event.target.value),
                                )
                            }
                            className="nc-input"
                            required
                        />
                        <InputError
                            message={errors.players_per_team}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="number_of_matches" className="nc-label">
                            Partidas no dia
                        </label>
                        <input
                            id="number_of_matches"
                            type="number"
                            min={1}
                            max={20}
                            value={data.number_of_matches}
                            onChange={(event) =>
                                setData(
                                    'number_of_matches',
                                    Number(event.target.value),
                                )
                            }
                            className="nc-input"
                            required
                        />
                        <InputError
                            message={errors.number_of_matches}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="nc-btn flex-1"
                        >
                            {processing ? 'Criando…' : 'Criar match day'}
                        </button>
                        <Link
                            href={route('matchDays.index')}
                            className="nc-btn nc-btn--quiet"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>

                <div
                    className="nc-panel nc-panel--accent max-w-xs p-4"
                    style={{ borderLeft: '2px solid var(--color-accent)' }}
                >
                    <div className="u-kicker">Dica</div>
                    <p
                        className="mt-1.5 text-[11px] leading-relaxed"
                        style={{ color: 'var(--color-neutral-400)' }}
                    >
                        Após criar, abra o match day e use o botão{' '}
                        <strong className="text-[var(--color-accent-200)]">
                            Balancear elenco
                        </strong>{' '}
                        para distribuir automaticamente os jogadores ativos
                        pelos times, na medida em que o overall permitir.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
