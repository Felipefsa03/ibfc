import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10">
            <div className="flex flex-col items-center">
                <Link href="/">
                    <span className="text-3xl font-extrabold tracking-tight text-white">
                        IBFC <span className="text-emerald-400">Team Builder</span>
                    </span>
                </Link>
                <p className="mt-2 text-sm text-slate-400">
                    Gestão de jogadores e formação de times
                </p>
            </div>

            <div className="mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/10 px-6 py-6 shadow-2xl backdrop-blur-md sm:px-8">
                {children}
            </div>

            <div className="mt-8 w-full">
                <Footer />
            </div>
        </div>
    );
}
