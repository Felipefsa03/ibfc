import Footer from '@/Components/Footer';
import { Head, Link } from '@inertiajs/react';

const messages: Record<number, { title: string; description: string }> = {
    404: {
        title: 'Página não encontrada',
        description: 'O endereço que você tentou acessar não existe ou foi movido.',
    },
    403: {
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar este recurso.',
    },
    419: {
        title: 'Sessão expirada',
        description: 'Sua sessão expirou. Faça login novamente para continuar.',
    },
    500: {
        title: 'Erro interno',
        description: 'Algo deu errado no servidor. Tente novamente em instantes.',
    },
};

export default function Error({ status }: { status: number }) {
    const message = messages[status] ?? {
        title: 'Algo deu errado',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            <Head title={message.title} />

            <div className="text-center">
                <p className="text-7xl font-extrabold text-white drop-shadow-lg">
                    {status}
                </p>
                <h1 className="mt-4 text-2xl font-bold text-white">
                    {message.title}
                </h1>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                    {message.description}
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                        href={route('dashboard')}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-500"
                    >
                        Ir para o Dashboard
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                        Voltar
                    </button>
                </div>
            </div>

            <div className="mt-16 w-full">
                <Footer />
            </div>
        </div>
    );
}
