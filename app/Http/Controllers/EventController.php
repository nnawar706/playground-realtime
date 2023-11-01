<?php

namespace App\Http\Controllers;

use App\Events\PlaygroundEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class EventController extends Controller
{
    public function publishEvent(Request $request): void
    {
        $data = array(
            'color'     => $request->color,
            'x_val'     => $request->x_val,
            'y_val'     => $request->y_val
        );

        Redis::publish('public.playground.1', $data);
    }
}
