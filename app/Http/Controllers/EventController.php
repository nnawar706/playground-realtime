<?php

namespace App\Http\Controllers;

use App\Events\PlaygroundEvent;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function fireEvent()
    {
        event(new PlaygroundEvent());
    }
}
