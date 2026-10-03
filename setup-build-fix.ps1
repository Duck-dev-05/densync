# One-time setup script to fix PowerShell execution policy
# Run this once to enable npm scripts to run properly

Write-Host "=== Setting up PowerShell for npm scripts ===" -ForegroundColor Magenta
Write-Host ""

$currentPolicy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "Current execution policy: $currentPolicy" -ForegroundColor Cyan

if ($currentPolicy -eq "Restricted" -or $currentPolicy -eq "Undefined") {
    Write-Host "Setting execution policy to RemoteSigned for current user..." -ForegroundColor Yellow
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
    Write-Host "Execution policy updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run npm scripts normally." -ForegroundColor Green
} else {
    Write-Host "Execution policy is already set to allow scripts." -ForegroundColor Green
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Magenta
