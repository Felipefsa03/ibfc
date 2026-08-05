import type { User } from './auth';

export type * from './auth';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

export type Player = {
    id: number;
    name: string;
    nickname: string | null;
    position: string | null;
    nationality: string | null;
    club: string | null;
    gol: number;
    sho: number;
    pas: number;
    dri: number;
    def: number;
    phy: number;
    overall_base: number;
    current_overall: number;
    active: boolean;
};

export type Team = {
    id: number;
    match_day_id: number;
    name: string;
    score: number;
    won: boolean;
    players?: Player[];
    total_overall?: number;
};

export type MatchDay = {
    id: number;
    date: string;
    number_of_matches: number;
    number_of_teams: number;
    players_per_team: number;
    /** ISO timestamp once the post-game step has paid out progression. */
    finalized_at?: string | null;
    teams_count?: number;
    players_count?: number;
    teams?: Team[];
};
