import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { positionName } from '@/lib/countries';

type RankingRow = {
    id: number;
    name: string;
    position: string | null;
    current_overall: number;
    value: number;
};

type Board = {
    goals: RankingRow[];
    assists: RankingRow[];
    goalsAssists: RankingRow[];
};

type RankingsProps = {
    goat: Board;
    month: Board;
};

const MEDALS = ['🥇', '🥈', '🥉'];

function RankingColumn({
    title,
    unit,
    rows,
}: {
    title: string;
    unit: string;
    rows: RankingRow[];
}) {
    return (
        <div className="nc-panel flex flex-col gap-2 p-3">
            <h3
                className="u-display text-[13px]"
                style={{
                    letterSpacing: '0.18em',
                    color: 'var(--color-neutral-400)',
                }}
            >
                {title}
            </h3>

            {rows.length === 0 ? (
                <p
                    className="text-[11px]"
                    style={{ color: 'var(--color-neutral-600)' }}
                >
                    Ninguém pontuou ainda.
                </p>
            ) : (
                <div className="flex flex-col gap-1.5">
                    {rows.map((row, index) => (
                        <Link
                            key={row.id}
                            href={route('cards.show', row.id)}
                            className="nc-row"
                        >
                            <span
                                className="text-lg leading-none"
                                aria-hidden="true"
                            >
                                {MEDALS[index] ?? `${index + 1}º`}
                            </span>

                            <div className="min-w-0 flex-1">
                                <div className="u-display truncate text-[14px]">
                                    {row.name}
                                </div>
                                <div className="u-meta truncate">
                                    {positionName(row.position)} · OVR{' '}
                                    {row.current_overall}
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <span
                                    className="u-display text-lg"
                                    style={{ color: 'var(--color-accent-200)' }}
                                >
                                    {row.value}
                                </span>
                                <span
                                    className="ml-1 text-[10px]"
                                    style={{
                                        color: 'var(--color-neutral-500)',
                                    }}
                                >
                                    {unit}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function RankingSection({
    icon,
    title,
    subtitle,
    board,
}: {
    icon: string;
    title: string;
    subtitle: string;
    board: Board;
}) {
    return (
        <section className="stu flex flex-col gap-3">
            <div>
                <div className="u-display flex items-center gap-2 text-[20px]">
                    <span aria-hidden="true">{icon}</span> {title}
                </div>
                <p className="u-meta mt-0.5">{subtitle}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <RankingColumn
                    title="Artilharia"
                    unit="gols"
                    rows={board.goals}
                />
                <RankingColumn
                    title="Assistências"
                    unit="assist."
                    rows={board.assists}
                />
                <RankingColumn
                    title="G/A"
                    unit="G/A"
                    rows={board.goalsAssists}
                />
            </div>
        </section>
    );
}

export default function Index({ goat, month }: RankingsProps) {
    return (
        <PublicLayout>
            <Head title="Rankings" />

            <div className="mb-6">
                <span className="u-kicker">Temporada 26</span>
                <h1 className="u-display mt-1 text-[31px]">Rankings</h1>
                <p
                    className="mt-1 text-[11px]"
                    style={{ color: 'var(--color-neutral-500)' }}
                >
                    Top 3 calculado direto do histórico de Match Days
                    finalizados.
                </p>
            </div>

            <div className="flex flex-col gap-8">
                <RankingSection
                    icon="🐐"
                    title="G.O.A.T."
                    subtitle="Maior da história"
                    board={goat}
                />
                <RankingSection
                    icon="🔥"
                    title="Mês"
                    subtitle="Últimos 30 dias"
                    board={month}
                />
            </div>
        </PublicLayout>
    );
}
