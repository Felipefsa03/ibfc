/**
 * Tactical attributes and the base-overall formula.
 *
 * Mirrors App\Services\OverallCalculatorService so the live preview in the
 * player form shows the same number the backend will persist. Keep the
 * weights in step with the service if they ever stop being equal.
 */
export const ATTRIBUTES = [
    { key: 'gol', label: 'GOL', name: 'Goleiro' },
    { key: 'sho', label: 'CHU', name: 'Chute' },
    { key: 'pas', label: 'PAS', name: 'Passe' },
    { key: 'dri', label: 'DRI', name: 'Drible' },
    { key: 'def', label: 'DEF', name: 'Defesa' },
    { key: 'phy', label: 'FIS', name: 'Físico' },
] as const;

export type AttributeKey = (typeof ATTRIBUTES)[number]['key'];

const WEIGHTS: Record<AttributeKey, number> = {
    gol: 1,
    sho: 1,
    pas: 1,
    dri: 1,
    def: 1,
    phy: 1,
};

export const ATTRIBUTE_MIN = 0;
export const ATTRIBUTE_MAX = 99;

export function overallBase(attributes: Record<AttributeKey, number>): number {
    let numerator = 0;
    let denominator = 0;

    for (const { key } of ATTRIBUTES) {
        numerator += Number(attributes[key]) * WEIGHTS[key];
        denominator += WEIGHTS[key];
    }

    return Math.round(numerator / denominator);
}
