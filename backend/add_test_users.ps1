# Script to add 20 test users to the EGA Java backend
# All users will have the password: jojo2000

$BaseUrl = "http://localhost:8080/api/auth/register"
$Password = "jojo2000"
$NumUsers = 15

# Sample data for generating realistic users
$FirstNames = @("John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Jessica", 
                "William", "Jennifer", "James", "Linda", "Richard", "Patricia", "Thomas", 
                "Barbara", "Charles", "Elizabeth", "Daniel", "Susan")

$LastNames = @("Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
               "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
               "Thomas", "Taylor", "Moore", "Jackson", "Martin")

$Genders = @("M", "F", "M", "F", "Autre")
$Nationalities = @("American", "British", "Canadian", "French", "German", "Spanish", "Italian",
                   "Mexican", "Brazilian", "Japanese", "Chinese", "Indian", "Australian")

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "EGA Banking App - Test User Creation Script" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Creating $NumUsers test users..."
Write-Host "Password for all users: $Password"
Write-Host "Backend URL: $BaseUrl"
Write-Host "----------------------------------------------------------------------"

$SuccessCount = 0
$FailedCount = 0

for ($i = 1; $i -le $NumUsers; $i++) {
    $email = "testuser$i@example.com"
    $firstName = $FirstNames[$i % $FirstNames.Count]
    $lastName = $LastNames[$i % $LastNames.Count]
    $gender = $Genders[$i % $Genders.Count]
    $nationality = $Nationalities[$i % $Nationalities.Count]
    $phoneNumber = "+1555{0:D7}" -f (Get-Random -Minimum 1000000 -Maximum 9999999)
    $address = "$i Main Street, Apt $i"
    
    # Generate random birthdate between 1970 and 2003
    $year = Get-Random -Minimum 1970 -Maximum 2004
    $month = Get-Random -Minimum 1 -Maximum 13
    $day = Get-Random -Minimum 1 -Maximum 29
    $birthDate = "{0:D4}-{1:D2}-{2:D2}" -f $year, $month, $day
    
    $userData = @{
        email = $email
        password = $Password
        firstName = $firstName
        lastName = $lastName
        userType = "CLIENT"
        phoneNumber = $phoneNumber
        address = $address
        gender = $gender
        birthDate = $birthDate
        nationality = $nationality
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $BaseUrl -Method Post -Body $userData -ContentType "application/json" -ErrorAction Stop
        Write-Host "✓ User $("{0,2}" -f $i) created: $email (ID: $($response.userId))" -ForegroundColor Green
        $SuccessCount++
    }
    catch {
        Write-Host "✗ Failed to create user $("{0,2}" -f $i): $email" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "  Status: $statusCode" -ForegroundColor Yellow
        }
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $FailedCount++
    }
    
    # Small delay to avoid overwhelming the server
    Start-Sleep -Milliseconds 100
}

Write-Host "----------------------------------------------------------------------"
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✓ Successfully created: $SuccessCount users" -ForegroundColor Green
Write-Host "  ✗ Failed: $FailedCount users" -ForegroundColor Red
Write-Host "======================================================================" -ForegroundColor Cyan

if ($SuccessCount -gt 0) {
    Write-Host ""
    Write-Host "Test users created with credentials:" -ForegroundColor Green
    Write-Host "  Email: testuser1@example.com to testuser$NumUsers@example.com"
    Write-Host "  Password: $Password"
    Write-Host ""
    Write-Host "You can now login with any of these accounts!" -ForegroundColor Green
}
