# Update version from git tag
# Usage: .\update-version.ps1 [version]
# If no version is provided, it will use the latest git tag

param(
    [string]$Version = ""
)

if ([string]::IsNullOrEmpty($Version)) {
    # Get latest git tag
    $tag = git describe --tags --abbrev=0 2>$null
    if ($LASTEXITCODE -eq 0 -and $tag) {
        $Version = $tag -replace '^v', ''
        Write-Host "Using latest git tag: $tag" -ForegroundColor Cyan
    } else {
        Write-Host "No git tag found. Please provide a version." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Updating version to $Version" -ForegroundColor Yellow

# Update package.json
$packageJson = Get-Content "package.json" -Raw
$packageJson = $packageJson -replace '"version": "[^"]+"', "`"version`": `"$Version`""
Set-Content "package.json" -Value $packageJson -NoNewline
Write-Host "Updated package.json" -ForegroundColor Green

# Update tauri.conf.json
$tauriConf = Get-Content "src-tauri\tauri.conf.json" -Raw
$tauriConf = $tauriConf -replace '"version": "[^"]+"', "`"version`": `"$Version`""
Set-Content "src-tauri\tauri.conf.json" -Value $tauriConf -NoNewline
Write-Host "Updated src-tauri/tauri.conf.json" -ForegroundColor Green

Write-Host "`nVersion updated to $Version" -ForegroundColor Green
Write-Host "Don't forget to commit these changes." -ForegroundColor Yellow
