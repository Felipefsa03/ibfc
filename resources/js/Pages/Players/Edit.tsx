import { Head, Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';
import PlayerForm from '@/Components/PlayerForm';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps, Player } from '@/types';

export default function Edit({ player }: PageProps<{ player: Player }>) {
    return (
        <AppLayout>
            <Head title={`Editar ${player.nickname || player.name}`} />

            <div className="mb-4">
                <Link
                    href={route('players.show', player.id)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-neutral-400)' }}
                >
                    <Icon name="caretLeft" size={12} /> Voltar
                </Link>
                <h1 className="u-display mt-2 text-[29px]">Editar jogador</h1>
            </div>

            <PlayerForm
                initialData={player}
                url={route('players.update', player.id)}
                method="put"
                submitLabel="Salvar"
                cancelHref={route('players.show', player.id)}
            />
        </AppLayout>
    );
}
