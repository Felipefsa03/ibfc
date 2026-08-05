<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMatchDayRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'number_of_matches' => ['required', 'integer', 'between:1,20'],
            'number_of_teams' => ['required', 'integer', 'between:2,16'],
            'players_per_team' => ['required', 'integer', 'between:1,20'],
        ];
    }
}
