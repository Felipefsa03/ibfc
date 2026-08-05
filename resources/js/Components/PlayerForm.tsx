import { Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import PlayerCard from '@/Components/PlayerCard';
import {
    COUNTRY_KEYS,
    POSITIONS,
    POSITION_KEYS,
    countryName,
} from '@/lib/countries';
import {
    ATTRIBUTES,
    ATTRIBUTE_MAX,
    ATTRIBUTE_MIN,
    overallBase,
} from '@/lib/overall';
import type { AttributeKey } from '@/lib/overall';
import type { Player } from '@/types';

type PlayerFormData = {
    name: string;
    nickname: string;
    position: string;
    nationality: string;
    club: string;
    gol: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
    active: boolean;
};

function previewPlayer(data: PlayerFormData, overall: number): Player {
    return {
        id: 0,
        name: data.name || 'Nome do jogador',
        nickname: data.nickname || null,
        position: data.position || null,
        nationality: data.nationality || null,
        club: data.club || null,
        gol: Number(data.gol),
        sho: Number(data.sho),
        pas: Number(data.pas),
        dri: Number(data.dri),
        def: Number(data.def),
        phy: Number(data.phy),
        overall_base: overall,
        current_overall: overall,
        active: data.active,
    };
}

export default function PlayerForm({
    initialData,
    url,
    method,
    submitLabel,
    cancelHref,
}: {
    initialData?: Partial<Player>;
    url: string;
    method: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
}) {
    const { data, setData, post, put, processing, errors } =
        useForm<PlayerFormData>({
            name: initialData?.name ?? '',
            nickname: initialData?.nickname ?? '',
            position: initialData?.position ?? '',
            nationality: initialData?.nationality ?? 'BR',
            club: initialData?.club ?? '',
            gol: initialData?.gol ?? 50,
            sho: initialData?.sho ?? 50,
            pas: initialData?.pas ?? 50,
            dri: initialData?.dri ?? 50,
            def: initialData?.def ?? 50,
            phy: initialData?.phy ?? 50,
            active: initialData?.active ?? true,
        });

    const liveOverall = overallBase(data as Record<AttributeKey, number>);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (method === 'post') {
            post(url);
        } else {
            put(url);
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
            <form onSubmit={submit} className="stu flex flex-col gap-3.5">
                <div className="nc-panel nc-panel--accent nc-panel--br flex items-center gap-3.5 p-3.5">
                    <div
                        className="nc-hex shrink-0"
                        style={{
                            width: 64,
                            height: 70,
                            background:
                                'linear-gradient(150deg, var(--color-accent-500), var(--color-accent-800))',
                        }}
                    >
                        <div className="text-center leading-none">
                            <div className="text-[27px] font-bold">
                                {liveOverall}
                            </div>
                            <div className="text-[7px] font-bold tracking-[0.2em] opacity-80">
                                OVR
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="u-kicker">Overall calculado</div>
                        <p
                            className="mt-1 max-w-[260px] text-[11px] leading-relaxed"
                            style={{ color: 'var(--color-neutral-400)' }}
                        >
                            Recalculado ao vivo pela média dos atributos — o
                            mesmo cálculo que o servidor grava ao salvar.
                        </p>
                    </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="name" className="nc-label">
                            Nome
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            className="nc-input"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="nickname" className="nc-label">
                            Apelido
                        </label>
                        <input
                            id="nickname"
                            type="text"
                            value={data.nickname}
                            onChange={(event) =>
                                setData('nickname', event.target.value)
                            }
                            className="nc-input"
                            required
                        />
                        <InputError
                            message={errors.nickname}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="position" className="nc-label">
                            Posição
                        </label>
                        <select
                            id="position"
                            value={data.position}
                            onChange={(event) =>
                                setData('position', event.target.value)
                            }
                            className="nc-input"
                        >
                            <option value="">Sem posição</option>
                            {POSITION_KEYS.map((key) => (
                                <option key={key} value={key}>
                                    {key} — {POSITIONS[key]}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.position}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="nationality" className="nc-label">
                            Nacionalidade
                        </label>
                        <select
                            id="nationality"
                            value={data.nationality}
                            onChange={(event) =>
                                setData('nationality', event.target.value)
                            }
                            className="nc-input"
                        >
                            <option value="">Indefinida</option>
                            {COUNTRY_KEYS.map((key) => (
                                <option key={key} value={key}>
                                    {countryName(key)}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.nationality}
                            className="mt-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="club" className="nc-label">
                            Clube
                        </label>
                        <input
                            id="club"
                            type="text"
                            value={data.club}
                            onChange={(event) =>
                                setData('club', event.target.value)
                            }
                            className="nc-input"
                        />
                        <InputError message={errors.club} className="mt-2" />
                    </div>
                </div>

                <div>
                    <span className="nc-label">Status</span>
                    <div
                        className="nc-tabs"
                        role="group"
                        aria-label="Status do jogador"
                    >
                        <button
                            type="button"
                            onClick={() => setData('active', true)}
                            aria-pressed={data.active}
                            className={data.active ? 'nc-tab is-on' : 'nc-tab'}
                        >
                            Ativo
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('active', false)}
                            aria-pressed={!data.active}
                            className={!data.active ? 'nc-tab is-on' : 'nc-tab'}
                        >
                            Inativo
                        </button>
                    </div>
                    <p
                        className="mt-1.5 text-[10px]"
                        style={{ color: 'var(--color-neutral-600)' }}
                    >
                        Apenas jogadores ativos entram na convocação de um match
                        day.
                    </p>
                </div>

                <div>
                    <h2
                        className="u-display mb-2.5 text-[13px]"
                        style={{
                            letterSpacing: '0.22em',
                            color: 'var(--color-neutral-400)',
                        }}
                    >
                        Atributos táticos
                    </h2>

                    <div className="flex flex-col gap-2.5">
                        {ATTRIBUTES.map((attribute) => (
                            <div key={attribute.key}>
                                <div className="flex items-baseline justify-between">
                                    <label
                                        htmlFor={attribute.key}
                                        className="text-[10px] font-bold tracking-[0.14em] uppercase"
                                        style={{
                                            color: 'var(--color-neutral-400)',
                                        }}
                                    >
                                        {attribute.name}
                                    </label>
                                    <span
                                        className="u-display text-[17px]"
                                        style={{
                                            color: 'var(--color-accent-200)',
                                        }}
                                    >
                                        {data[attribute.key]}
                                    </span>
                                </div>
                                <input
                                    id={attribute.key}
                                    type="range"
                                    min={ATTRIBUTE_MIN}
                                    max={ATTRIBUTE_MAX}
                                    value={data[attribute.key]}
                                    onChange={(event) =>
                                        setData(
                                            attribute.key,
                                            Number(event.target.value),
                                        )
                                    }
                                    className="nc-range mt-0.5"
                                />
                                <InputError message={errors[attribute.key]} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="nc-btn flex-1"
                    >
                        {processing ? 'Salvando…' : submitLabel}
                    </button>
                    <Link href={cancelHref} className="nc-btn nc-btn--quiet">
                        Cancelar
                    </Link>
                </div>
            </form>

            <div className="flex flex-col items-center gap-3 lg:sticky lg:top-6">
                <span className="u-meta">Pré-visualização</span>
                <PlayerCard
                    player={previewPlayer(data, liveOverall)}
                    size="lg"
                />
            </div>
        </div>
    );
}
