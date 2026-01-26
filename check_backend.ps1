try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8080/api-docs" -Method Get
    Write-Host "✅ Backend is UP and API Docs are accessible."
    Write-Host "Response summary: $($response.info.title)"
} catch {
    Write-Host "❌ Backend might be DOWN or unreachable."
    Write-Host "Error: $($_.Exception.Message)"
}
