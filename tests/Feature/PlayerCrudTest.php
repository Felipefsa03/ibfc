<?php

use App\Models\Player;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

it('lists players on the index page', function () {
    Player::factory()->count(3)->create();

    $this->get(route('players.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Players/Index')
            ->has('players', 3));
});

it('filters players by search and status', function () {
    Player::factory()->create(['name' => 'Fulano Teste', 'active' => true]);
    Player::factory()->inactive()->create(['name' => 'Ciclano Teste']);

    $this->get(route('players.index', ['search' => 'Fulano']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('players', 1));

    $this->get(route('players.index', ['status' => 'inactive']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('players', 1));
});

it('creates a player with the calculated overall', function () {
    $response = $this->post(route('players.store'), [
        'name' => 'Novo Jogador',
        'nickname' => 'Novinho',
        'position' => 'ATA',
        'nationality' => 'BR',
        'club' => 'IBFC',
        'gol' => 10,
        'sho' => 70,
        'pas' => 65,
        'dri' => 68,
        'def' => 40,
        'phy' => 72,
    ]);

    $response->assertRedirect(route('players.index'));

    $this->assertDatabaseHas('players', [
        'nickname' => 'Novinho',
        'overall_base' => 54,
        'current_overall' => 54,
        'active' => true,
    ]);
});

it('rejects a duplicate nickname on create', function () {
    Player::factory()->create(['nickname' => 'Duplicado']);

    $this->post(route('players.store'), [
        'name' => 'Outro',
        'nickname' => 'Duplicado',
        'gol' => 50,
        'sho' => 50,
        'pas' => 50,
        'dri' => 50,
        'def' => 50,
        'phy' => 50,
    ])->assertSessionHasErrors('nickname');
});

it('shows a player profile', function () {
    $player = Player::factory()->create();

    $this->get(route('players.show', $player))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Players/Show')
            ->where('player.id', $player->id));
});

it('updates a player recalculating the base overall but preserving the current one', function () {
    $player = Player::factory()->create([
        'nickname' => 'Estrela',
        'overall_base' => 60,
        'current_overall' => 70,
    ]);

    $this->put(route('players.update', $player), [
        'name' => $player->name,
        'nickname' => $player->nickname,
        'position' => 'ZAG',
        'nationality' => 'BR',
        'club' => 'IBFC',
        'gol' => 10,
        'sho' => 70,
        'pas' => 65,
        'dri' => 68,
        'def' => 40,
        'phy' => 72,
    ])->assertRedirect(route('players.show', $player));

    $player->refresh();

    expect($player->overall_base)->toBe(54);
    expect($player->current_overall)->toBe(70);
});

it('allows editing without clashing with its own nickname', function () {
    $player = Player::factory()->create(['nickname' => 'Unico']);

    $this->put(route('players.update', $player), [
        'name' => $player->name,
        'nickname' => 'Unico',
        'gol' => 50,
        'sho' => 50,
        'pas' => 50,
        'dri' => 50,
        'def' => 50,
        'phy' => 50,
    ])->assertSessionHasNoErrors('nickname');
});

it('deletes a player without history', function () {
    $player = Player::factory()->create();

    $this->delete(route('players.destroy', $player))
        ->assertRedirect(route('players.index'));

    $this->assertDatabaseMissing('players', ['id' => $player->id]);
});

it('inactivates a player with history instead of deleting', function () {
    $player = Player::factory()->create();
    $team = Team::factory()->create();
    $player->teamPlayers()->create(['team_id' => $team->id]);

    $this->delete(route('players.destroy', $player))
        ->assertRedirect(route('players.index'));

    $this->assertDatabaseHas('players', [
        'id' => $player->id,
        'active' => false,
    ]);
});
