<?php

namespace App\Console\Commands;

use App\Events\PlaygroundEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class SubscribeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'redis:subscribe';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Redis::subscribe('public.playground.1', function ($data) {
            PlaygroundEvent::dispatch($data);
        });
    }
}
