<!doctype html>
<html>

<body style="font-family: Arial, sans-serif;">
    <h2>Hello {{ $name }},</h2>
    <p>Your OTP code is:</p>
    <h1 style="letter-spacing: 6px;">{{ $code }}</h1>
    <p>This code expires in {{ $minutes }} minutes.</p>
</body>

</html>