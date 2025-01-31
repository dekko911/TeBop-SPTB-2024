<?php
// contoh url : http://127.0.0.1:8000/api/(route yang akan dituju contoh: (/users, /pages/users, /admin/users, /seats, /login, /ticket, /payment, etc.))

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SeatController;
use App\Http\Controllers\ShowController;
use App\Http\Controllers\StudioController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/sign_up', [UserController::class, 'store'])->name('sign_up');

// untuk route admin
Route::middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    // Route::get('/profile', [UserController::class, 'show']);
    Route::apiResource('/admin/t_genres', GenreController::class);
    Route::apiResource('/admin/t_studios', StudioController::class);
    Route::apiResource('/admin/t_movies', MovieController::class);
    Route::apiResource('/admin/t_payments', PaymentController::class);
    Route::apiResource('/admin/t_seats', SeatController::class);
    Route::apiResource('/admin/t_shows', ShowController::class);
    Route::apiResource('/admin/t_tickets', TicketController::class);
    Route::apiResource('/admin/users', UserController::class);
    Route::apiResource('/admin/roles', RoleController::class);
});

// untuk route user
Route::middleware(['auth:sanctum', 'ability:user,writer,editor'])->group(function () {
    // Route::get('/user/profile', [UserController::class, 'show']);
    Route::apiResource('/user/t_studios', StudioController::class);
    Route::apiResource('/user/users', UserController::class);
    Route::apiResource('/user/t_movies', MovieController::class);
    Route::apiResource('/user/t_payments', PaymentController::class);
    Route::apiResource('/user/t_seats', SeatController::class);
    Route::apiResource('/user/t_shows', ShowController::class);
    Route::apiResource('/user/t_tickets', TicketController::class);
});