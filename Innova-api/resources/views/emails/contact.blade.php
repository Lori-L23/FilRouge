<!DOCTYPE html>
<html>

<head>
    <title>Nouveau message de contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #4f46e5;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
        }

        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }

        .detail {
            margin-bottom: 15px;
        }

        .label {
            font-weight: bold;
            color: #4f46e5;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Nouveau message de contact</h1>
        </div>
        <div class="content">
            <div class="detail">
                <span class="label">Rôle:</span> {{ $contact->role }}
            </div>
            <div class="detail">
                <span class="label">Sujet:</span> {{ $contact->subject }}
            </div>
            <div class="detail">
                <span class="label">Email:</span> {{ $contact->email }}
            </div>
            <div class="detail">
                <span class="label">Message:</span>
                <p>{{ $contact->message }}</p>
            </div>
        </div>
    </div>
</body>

</html>