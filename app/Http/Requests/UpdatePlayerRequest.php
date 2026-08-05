<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlayerRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'nickname' => ['required', 'string', 'max:255', Rule::unique('players', 'nickname')->ignore($this->player)],
            'position' => ['nullable', 'string', 'max:10'],
            'nationality' => ['nullable', 'string', 'size:2'],
            'club' => ['nullable', 'string', 'max:100'],
            'gol' => ['required', 'integer', 'between:0,99'],
            'sho' => ['required', 'integer', 'between:0,99'],
            'pas' => ['required', 'integer', 'between:0,99'],
            'dri' => ['required', 'integer', 'between:0,99'],
            'def' => ['required', 'integer', 'between:0,99'],
            'phy' => ['required', 'integer', 'between:0,99'],
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
