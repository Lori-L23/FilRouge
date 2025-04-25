<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // 'allowed_origins' => [''],
    'allowed_origins' => ['http://localhost:3000'],
  
    
    'allowed_headers' => ['*'],

    'allowed_origins_patterns' => [],


    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
