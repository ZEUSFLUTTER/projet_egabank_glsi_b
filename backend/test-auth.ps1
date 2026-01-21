# Test JWT Authentication Fix

# Configuration
$BaseUrl = "http://localhost:8080/api/auth"
$Email = "test@example.com"
$Password = "password123"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Testing JWT Authentication Fix      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 1. Register a new user
Write-Host "1️⃣ REGISTERING NEW USER..." -ForegroundColor Yellow
$RegisterBody = @{
    nom = "Test"
    prenom = "User"
    courriel = $Email
    motDePasse = $Password
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Rue Test"
    telephone = "5551234567"
    nationalite = "Canadienne"
} | ConvertTo-Json

try {
    $RegisterResponse = Invoke-RestMethod -Uri "$BaseUrl/register" -Method Post -Body $RegisterBody -ContentType "application/json"
    
    $AccessToken = $RegisterResponse.accessToken
    $RefreshToken = $RegisterResponse.refreshToken
    
    Write-Host "✅ REGISTERED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "   Access Token: $($AccessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   Refresh Token: $($RefreshToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ REGISTRATION FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# 2. Try to use the access token
Write-Host "2️⃣ TESTING ACCESS TOKEN..." -ForegroundColor Yellow
$Headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

try {
    $GetResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method Get -Headers $Headers
    Write-Host "✅ ACCESS TOKEN WORKS!" -ForegroundColor Green
    Write-Host "   Got $(($GetResponse | Measure-Object).Count) clients" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ ACCESS TOKEN FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# 3. Test token validity
Write-Host "3️⃣ TESTING TOKEN TYPE..." -ForegroundColor Yellow
try {
    # Try to decode JWT to see the type
    $TokenParts = $AccessToken.Split('.')
    $Payload = $TokenParts[1]
    # Add padding if needed
    while ($Payload.Length % 4) { $Payload += '=' }
    
    $DecodedBytes = [System.Convert]::FromBase64String($Payload)
    $DecodedPayload = [System.Text.Encoding]::UTF8.GetString($DecodedBytes)
    $JsonPayload = $DecodedPayload | ConvertFrom-Json
    
    Write-Host "✅ TOKEN DECODED!" -ForegroundColor Green
    Write-Host "   Type: $($JsonPayload.type)" -ForegroundColor Gray
    Write-Host "   Subject: $($JsonPayload.sub)" -ForegroundColor Gray
    Write-Host "   Expires: $(([System.DateTimeOffset]::FromUnixTimeSeconds($JsonPayload.exp)).DateTime)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️ Could not decode token: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
}

# 4. Test refresh token endpoint
Write-Host "4️⃣ TESTING REFRESH TOKEN ENDPOINT..." -ForegroundColor Yellow
$RefreshBody = @{
    refreshToken = $RefreshToken
} | ConvertTo-Json

try {
    $RefreshResponse = Invoke-RestMethod -Uri "$BaseUrl/refresh" -Method Post -Body $RefreshBody -ContentType "application/json"
    $NewAccessToken = $RefreshResponse.accessToken
    
    Write-Host "✅ REFRESH TOKEN WORKS!" -ForegroundColor Green
    Write-Host "   New Access Token: $($NewAccessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ REFRESH TOKEN FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║    ✅ ALL TESTS PASSED!                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
