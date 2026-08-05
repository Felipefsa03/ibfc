<?php

use App\Models\Player;
use Illuminate\Support\Facades\Route;

it('lists players without requiring authentication', function () {
    Player::factory()->count(3)->create();

    $this->get(route('cards.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Cards/Index')
            ->has('players', 3));
});

it('shows a player card without requiring authentication', function () {
    $player = Player::factory()->create();

    $this->get(route('cards.show', $player))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Cards/Show')
            ->where('player.id', $player->id)
            ->has('totals')
            ->has('history'));
});

it('finds a player by name or nickname', function () {
    Player::factory()->create(['name' => 'Ricardo Souza', 'nickname' => null]);
    Player::factory()->create(['name' => 'Someone Else', 'nickname' => 'Ricardinho']);
    Player::factory()->create(['name' => 'Unrelated Player', 'nickname' => null]);

    $this->get(route('cards.index', ['search' => 'ricard']))
        ->assertInertia(fn ($page) => $page->has('players', 2));
});

it('filters by active status', function () {
    Player::factory()->count(2)->create(['active' => true]);
    Player::factory()->inactive()->create();

    $this->get(route('cards.index', ['status' => 'inactive']))
        ->assertInertia(fn ($page) => $page->has('players', 1));

    $this->get(route('cards.index', ['status' => 'active']))
        ->assertInertia(fn ($page) => $page->has('players', 2));
});

it('sorts by overall by default, strongest first', function () {
    Player::factory()->create(['name' => 'Weak', 'current_overall' => 40]);
    Player::factory()->create(['name' => 'Strong', 'current_overall' => 90]);

    $this->get(route('cards.index'))
        ->assertInertia(fn ($page) => $page
            ->where('players.0.name', 'Strong')
            ->where('players.1.name', 'Weak'));
});

it('sorts by name when requested', function () {
    Player::factory()->create(['name' => 'Zeca', 'current_overall' => 90]);
    Player::factory()->create(['name' => 'Ana', 'current_overall' => 40]);

    $this->get(route('cards.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertInertia(fn ($page) => $page
            ->where('players.0.name', 'Ana')
            ->where('players.1.name', 'Zeca'));
});

it('returns a 404 for a player that does not exist', function () {
    $this->get('/cartas/999999')->assertNotFound();
});

it('never exposes a write route publicly', function () {
    // The public "cards." routes must only ever be GET/HEAD.
    $methods = collect(Route::getRoutes())
        ->filter(fn ($route) => str_starts_with($route->getName() ?? '', 'cards.'))
        ->pluck('methods')
        ->flatten()
        ->unique();

    expect($methods->all())->toEqualCanonicalizing(['GET', 'HEAD']);
});
