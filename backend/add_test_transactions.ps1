# Script to add test transactions to existing accounts
# Make sure the backend is running on http://localhost:8080

$BaseUrl = "http://localhost:8080/api"
$Username = "testuser1@example.com"  # Change this to an existing user
$Password = "jojo2000"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "EGA Banking App - Test Transactions Creation Script" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# Step 1: Login
Write-Host "`nStep 1: Logging in as $Username..." -ForegroundColor Yellow

$loginData = @{
    email = $Username
    password = $Password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.token
    $clientId = $loginResponse.userId
    Write-Host "✓ Login successful! Client ID: $clientId" -ForegroundColor Green
}
catch {
    Write-Host "✗ Login failed. Make sure the user exists and the backend is running." -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    exit
}

# Step 2: Get accounts
Write-Host "`nStep 2: Fetching accounts for client..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $accounts = Invoke-RestMethod -Uri "$BaseUrl/accounts/client/$clientId" -Method Get -Headers $headers -ErrorAction Stop
    
    if ($accounts.Count -eq 0) {
        Write-Host "✗ No accounts found for this client. Please create an account first." -ForegroundColor Red
        exit
    }
    
    Write-Host "✓ Found $($accounts.Count) account(s)" -ForegroundColor Green
    foreach ($acc in $accounts) {
        Write-Host "  - Account: $($acc.accountNumber) | Type: $($acc.accountType) | Balance: $($acc.balance) FCFA" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "✗ Failed to fetch accounts." -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    exit
}

# Step 3: Create test transactions
Write-Host "`nStep 3: Creating test transactions..." -ForegroundColor Yellow

$primaryAccount = $accounts[0]
$SuccessCount = 0
$FailedCount = 0

# Create 5 DEPOSIT transactions
Write-Host "`nCreating deposits..." -ForegroundColor Cyan
for ($i = 1; $i -le 5; $i++) {
    $amount = Get-Random -Minimum 5000 -Maximum 50000
    
    $transactionData = [PSCustomObject]@{
        amount = [double]$amount
        transactionType = "DEPOSIT"
        description = "Test Deposit #$i"
        sourceAccount = @{
            id = [int]$primaryAccount.id
        }
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/transactions" -Method Post -Body $transactionData -ContentType "application/json" -Headers $headers -ErrorAction Stop
        Write-Host "  ✓ Deposit created: $amount FCFA" -ForegroundColor Green
        $SuccessCount++
    }
    catch {
        Write-Host "  ✗ Failed to create deposit" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $FailedCount++
    }
    Start-Sleep -Milliseconds 200
}

# Create 5 WITHDRAWAL transactions
Write-Host "`nCreating withdrawals..." -ForegroundColor Cyan
for ($i = 1; $i -le 5; $i++) {
    $amount = Get-Random -Minimum 1000 -Maximum 10000
    
    $transactionData = [PSCustomObject]@{
        amount = [double]$amount
        transactionType = "WITHDRAWAL"
        description = "Test Withdrawal #$i"
        sourceAccount = @{
            id = [int]$primaryAccount.id
        }
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/transactions" -Method Post -Body $transactionData -ContentType "application/json" -Headers $headers -ErrorAction Stop
        Write-Host "  ✓ Withdrawal created: $amount FCFA" -ForegroundColor Green
        $SuccessCount++
    }
    catch {
        Write-Host "  ✗ Failed to create withdrawal" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $FailedCount++
    }
    Start-Sleep -Milliseconds 200
}

# If there's a second account, create some transfers
if ($accounts.Count -gt 1) {
    $secondAccount = $accounts[1]
    Write-Host "`nCreating transfers..." -ForegroundColor Cyan
    
    for ($i = 1; $i -le 3; $i++) {
        $amount = Get-Random -Minimum 2000 -Maximum 15000
        
        $transactionData = [PSCustomObject]@{
            amount = [double]$amount
            transactionType = "TRANSFER"
            description = "Test Transfer #$i"
            sourceAccount = @{
                id = [int]$primaryAccount.id
            }
            destinationAccount = @{
                id = [int]$secondAccount.id
            }
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "$BaseUrl/transactions" -Method Post -Body $transactionData -ContentType "application/json" -Headers $headers -ErrorAction Stop
            Write-Host "  ✓ Transfer created: $amount FCFA" -ForegroundColor Green
            $SuccessCount++
        }
        catch {
            Write-Host "  ✗ Failed to create transfer" -ForegroundColor Red
            Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Yellow
            $FailedCount++
        }
        Start-Sleep -Milliseconds 200
    }
}

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✓ Successfully created: $SuccessCount transactions" -ForegroundColor Green
Write-Host "  ✗ Failed: $FailedCount transactions" -ForegroundColor Red
Write-Host "======================================================================" -ForegroundColor Cyan

if ($SuccessCount -gt 0) {
    Write-Host "`nTest transactions created successfully!" -ForegroundColor Green
    Write-Host "You can now view them in the transaction history page." -ForegroundColor Green
}
