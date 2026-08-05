import { Head, Link } from '@inertiajs/react';
import Icon from '@/Components/Icon';
import PlayerForm from '@/Components/PlayerForm';
import AppLayout from '@/Layouts/AppLayout';

export default function Create() {
    return (
        <AppLayout>
            <Head title="Novo jogador" />

            <div className="mb-4">
                <Link
                    href={route('players.index')}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-neutral-400)' }}
                >
                    <Icon name="caretLeft" size={12} /> Elenco
                </Link>
                <h1 className="u-display mt-2 text-[29px]">Novo jogador</h1>
            </div>

            <PlayerForm
                url={route('players.store')}
                method="post"
                submitLabel="Cadastrar"
                cancelHref={route('players.index')}
            />
        </AppLayout>
    );
}
