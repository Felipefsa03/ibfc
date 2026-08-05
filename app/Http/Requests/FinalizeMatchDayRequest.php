<?php

namespace App\Http\Requests;

use App\Models\MatchDay;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FinalizeMatchDayRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Only players actually called up for this match day may receive stats,
     * which is enforced against the team_players pivot.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $matchDay = $this->route('matchDay');
        $teamIds = $matchDay instanceof MatchDay
            ? $matchDay->teams()->pluck('id')->all()
            : [];

        return [
            'stats' => ['required', 'array', 'min:1'],
            'stats.*.player_id' => [
                'required',
                'integer',
                Rule::exists('team_players', 'player_id')->whereIn('team_id', $teamIds),
            ],
            'stats.*.goals' => ['required', 'integer', 'between:0,99'],
            'stats.*.assists' => ['required', 'integer', 'between:0,99'],
            'stats.*.decisive_passes' => ['required', 'integer', 'between:0,999'],
            'stats.*.stars' => ['required', 'integer', 'between:0,5'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'stats.required' => 'Informe a performance dos jogadores convocados.',
            'stats.*.player_id.exists' => 'Este jogador não está convocado para este match day.',
            'stats.*.goals.between' => 'Gols deve ficar entre 0 e 99.',
            'stats.*.assists.between' => 'Assistências deve ficar entre 0 e 99.',
            'stats.*.decisive_passes.between' => 'Passes decisivos deve ficar entre 0 e 999.',
            'stats.*.stars.between' => 'Estrelas deve ficar entre 0 e 5.',
        ];
    }
}
