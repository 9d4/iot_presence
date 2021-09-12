const mix = require("laravel-mix");

mix.js("views/js/student-reg.js", "public/dist").vue();
mix.js("views/js/presence-realtime.js", "public/dist").vue();
