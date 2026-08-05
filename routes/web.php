<?php

use App\Http\Controllers\MatchDayController;
use App\Http\Controllers\MatchDayFinalizationController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\CardController;
use App\Http\Controllers\Public\RankingController;
use App\Http\Controllers\TeamController;
use App\Models\Player;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

// Public portal — no authentication, read-only. Anyone with the link can
// look up a player's card and the season leaderboards.
Route::prefix('cartas')->name('cards.')->group(function () {
    Route::get('/', [CardController::class, 'index'])->name('index');
    Route::get('/{player}', [CardController::class, 'show'])->name('show');
});
Route::get('/rankings', [RankingController::class, 'index'])->name('rankings.index');

Route::get('/dashboard', function () {
    $players = Player::query()
        ->orderByDesc('current_overall')
        ->get();

    return Inertia::render('Dashboard', [
        'stats' => [
            'total' => $players->count(),
            'active' => $players->where('active', true)->count(),
            'inactive' => $players->where('active', false)->count(),
            'average' => (int) round($players->where('active', true)->avg('current_overall') ?? 0),
            'topPlayers' => $players
                ->where('active', true)
                ->take(5)
                ->values()
                ->all(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/configuracoes', function () {
        return Inertia::render('Settings/Index');
    })->name('settings.index');

    Route::get('/jogadores', [PlayerController::class, 'index'])->name('players.index');
    Route::get('/jogador/criar', [PlayerController::class, 'create'])->name('players.create');
    Route::post('/jogador', [PlayerController::class, 'store'])->name('players.store');
    Route::get('/jogador/{player}', [PlayerController::class, 'show'])->name('players.show');
    Route::get('/jogador/{player}/editar', [PlayerController::class, 'edit'])->name('players.edit');
    Route::put('/jogador/{player}', [PlayerController::class, 'update'])->name('players.update');
    Route::delete('/jogador/{player}', [PlayerController::class, 'destroy'])->name('players.destroy');

    Route::get('/match-days', [MatchDayController::class, 'index'])->name('matchDays.index');
    Route::get('/match-days/criar', [MatchDayController::class, 'create'])->name('matchDays.create');
    Route::post('/match-days', [MatchDayController::class, 'store'])->name('matchDays.store');
    Route::get('/match-days/{matchDay}', [MatchDayController::class, 'show'])->name('matchDays.show');
    Route::delete('/match-days/{matchDay}', [MatchDayController::class, 'destroy'])->name('matchDays.destroy');
    Route::post('/match-days/{matchDay}/balancear', [MatchDayController::class, 'balance'])->name('matchDays.balance');
    Route::get('/match-days/{matchDay}/finalizar', [MatchDayFinalizationController::class, 'create'])->name('matchDays.finalize');
    Route::post('/match-days/{matchDay}/finalizar', [MatchDayFinalizationController::class, 'store'])->name('matchDays.finalize.store');

    Route::post('/match-days/{matchDay}/times', [TeamController::class, 'store'])->name('teams.store');
    Route::put('/match-days/{matchDay}/times/{team}', [TeamController::class, 'update'])->name('teams.update');
    Route::delete('/match-days/{matchDay}/times/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
    Route::post('/match-days/{matchDay}/times/{team}/jogadores/{player}', [TeamController::class, 'attach'])->name('teams.attach');
    Route::delete('/match-days/{matchDay}/times/{team}/jogadores/{player}', [TeamController::class, 'detach'])->name('teams.detach');
});

require __DIR__.'/auth.php';
