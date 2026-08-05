const COUNTRY_NAMES: Record<string, string> = {
    AR: 'Argentina',
    BR: 'Brasil',
    CO: 'Colômbia',
    DE: 'Alemanha',
    ES: 'Espanha',
    FR: 'França',
    IT: 'Itália',
    NL: 'Holanda',
    PT: 'Portugal',
    UY: 'Uruguai',
};

export function flagEmoji(countryCode: string | null): string {
    if (!countryCode || countryCode.length !== 2) {
        return '🌍';
    }

    const code = countryCode.toUpperCase();

    return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

export function countryName(countryCode: string | null): string {
    if (!countryCode) {
        return 'Indefinido';
    }

    return COUNTRY_NAMES[countryCode.toUpperCase()] ?? countryCode.toUpperCase();
}

export const POSITIONS: Record<string, string> = {
    GOL: 'Goleiro',
    ZAG: 'Zagueiro',
    LD: 'Lateral Direito',
    LE: 'Lateral Esquerdo',
    VOL: 'Volante',
    MC: 'Meia Central',
    MEI: 'Meia Ofensivo',
    PD: 'Ponta Direita',
    PE: 'Ponta Esquerda',
    ATA: 'Atacante',
};

export const POSITION_KEYS = Object.keys(POSITIONS);

export const COUNTRY_KEYS = Object.keys(COUNTRY_NAMES);

export function positionName(position: string | null): string {
    if (!position) {
        return 'Sem posição';
    }

    return POSITIONS[position.toUpperCase()] ?? position.toUpperCase();
}
