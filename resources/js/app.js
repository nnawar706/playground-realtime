import './bootstrap.js';
import Echo from "laravel-echo";

const channel = window.Echo.channel('public.playground.1');

channel.subscribed(() => {
    console.log('subscribed to channel.');
}).listen('.playground', (event) => {
    console.log(event);
});


