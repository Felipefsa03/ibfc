import { Head, Link, router, usePage } from '@inertiajs/react';
import Icon from '@/Components/Icon';
import AppLayout from '@/Layouts/AppLayout';
import { formatDate } from '@/lib/dates';
import type { MatchDay, PageProps } from '@/types';

type IndexProps = PageProps<{
    matchDays: MatchDay[];
}>;

export default function Index({ matchDays }: IndexProps) {
    const { flash } = usePage().props;

    const removeMatchDay = (matchDay: MatchDay) => {
        if (
            window.confirm(
                `Excluir o match day de ${formatDate(matchDay.date)}?\n\nOs times e as convocações deste dia também serão removidos.`,
            )
        ) {
            router.delete(route('matchDays.destroy', matchDay.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Match Days" />

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
                        <h1 className="u-display mt-1 text-[31px]">
                            Match Days
                        </h1>
                    </div>

                    <Link
                        href={route('matchDays.create')}
                        className="nc-btn nc-btn--sm"
                    >
                        <Icon name="plus" size={13} /> Novo
                    </Link>
                </div>

                <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: 'var(--color-neutral-500)' }}
                >
                    Cada match day agrupa os times daquele dia. Monte os times
                    manualmente ou deixe o balanceador distribuir o elenco pelo
                    overall.
                </p>
            </div>

            {matchDays.length === 0 ? (
                <div
                    className="mt-7 px-5 py-10 text-center"
                    style={{ border: '1px dashed var(--color-neutral-800)' }}
                >
                    <p className="u-display text-[17px]">
                        Nenhum match day ainda
                    </p>
                    <p
                        className="mt-1.5 text-[11px]"
                        style={{ color: 'var(--color-neutral-500)' }}
                    >
                        Crie o primeiro dia de jogo e balanceie o elenco
                        automaticamente.
                    </p>
                    <Link
                        href={route('matchDays.create')}
                        className="nc-btn nc-btn--sm mt-5"
                    >
                        <Icon name="plus" size={13} /> Criar match day
                    </Link>
                </div>
            ) : (
                <div className="st mt-4 flex flex-col gap-2">
                    {matchDays.map((matchDay) => (
                        <div
                            key={matchDay.id}
                            className="nc-row flex items-center justify-between gap-3 p-3.5"
                        >
                            <Link
                                href={route('matchDays.show', matchDay.id)}
                                className="flex min-w-0 flex-1 items-center gap-3.5"
                            >
                                <div>
                                    <div className="u-display text-[17px] leading-tight">
                                        {formatDate(matchDay.date)}
                                    </div>
                                    <div
                                        className="u-meta mt-0.5"
                                        style={{
                                            color: 'var(--color-neutral-500)',
                                        }}
                                    >
                                        {matchDay.number_of_matches} partida
                                        {matchDay.number_of_matches === 1
                                            ? ''
                                            : 's'}
                                    </div>
                                </div>

                                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                                    <span className="nc-tag nc-tag--accent">
                                        {matchDay.teams_count} time
                                        {matchDay.teams_count === 1 ? '' : 's'}
                                    </span>
                                    <span className="nc-tag nc-tag--neutral">
                                        {matchDay.players_count} convocados
                                    </span>
                                    <Icon
                                        name="caretRight"
                                        size={15}
                                        style={{
                                            color: 'var(--color-neutral-600)',
                                        }}
                                    />
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={() => removeMatchDay(matchDay)}
                                aria-label="Excluir match day"
                                className="shrink-0 p-2 transition-colors"
                                style={{ color: 'var(--color-neutral-600)' }}
                            >
                                <Icon name="trash" size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
