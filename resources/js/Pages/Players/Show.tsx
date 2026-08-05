import { Head, Link, router, usePage } from '@inertiajs/react';
import AttributeBars from '@/Components/AttributeBars';
import Icon from '@/Components/Icon';
import PlayerCard from '@/Components/PlayerCard';
import TiltCard from '@/Components/TiltCard';
import AppLayout from '@/Layouts/AppLayout';
import { paceFrom } from '@/lib/cards';
import { countryName, positionName } from '@/lib/countries';
import type { PageProps, Player } from '@/types';

export default function Show({ player }: PageProps<{ player: Player }>) {
    const { flash } = usePage().props;

    const removePlayer = () => {
        if (
            window.confirm(
                `Remover "${player.nickname || player.name}"?\n\nJogadores com histórico de partidas são apenas inativados, preservando as estatísticas. Sem histórico, o cadastro é excluído.`,
            )
        ) {
            router.delete(route('players.destroy', player.id));
        }
    };

    const totals = [
        { label: 'OVR base', value: player.overall_base },
        { label: 'OVR atual', value: player.current_overall },
        { label: 'Ritmo', value: paceFrom(player) },
    ];

    return (
        <AppLayout>
            <Head title={player.nickname || player.name} />

            <Link
                href={route('players.index')}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors"
                style={{ color: 'var(--color-neutral-400)' }}
            >
                <Icon name="caretLeft" size={12} /> Elenco
            </Link>

            {flash?.success && (
                <div
                    className="nc-panel nc-panel--top mt-4 px-4 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: 'var(--color-accent-200)' }}
                >
                    {flash.success}
                </div>
            )}

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
                        {totals.map((total) => (
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
                            Atributos
                        </h2>

                        <div className="mt-2.5">
                            <AttributeBars player={player} />
                        </div>
                    </div>

                    <div className="mt-1 flex gap-2">
                        <Link
                            href={route('players.edit', player.id)}
                            className="nc-btn flex-1"
                        >
                            <Icon name="pencil" size={15} /> Editar
                        </Link>
                        <button
                            type="button"
                            onClick={removePlayer}
                            className="nc-btn nc-btn--quiet nc-btn--danger"
                        >
                            <Icon name="trash" size={15} />
                            {player.active ? 'Inativar' : 'Excluir'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
