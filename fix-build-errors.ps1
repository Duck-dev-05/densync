# Automated Build Error Detection and Fixing Script
# This script detects common build errors and applies fixes automatically

param(
    [string]$Command = "npm run build"
)

function Test-ExecutionPolicy {
    $policy = Get-ExecutionPolicy -Scope CurrentUser
    Write-Host "Current PowerShell Execution Policy: $policy" -ForegroundColor Cyan
    return $policy
}

function Set-ExecutionPolicyIfNeeded {
    $policy = Get-ExecutionPolicy -Scope CurrentUser
    if ($policy -eq "Restricted" -or $policy -eq "Undefined") {
        Write-Host "Setting execution policy to RemoteSigned for current user..." -ForegroundColor Yellow
        Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
        Write-Host "Execution policy updated successfully!" -ForegroundColor Green
        return $true
    }
    return $false
}

function Test-NodeModules {
    if (-not (Test-Path "node_modules")) {
        Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Dependencies installed successfully!" -ForegroundColor Green
            return $true
        }
        return $false
    }
    return $true
}

function Test-DistDirectory {
    if (Test-Path "dist") {
        Write-Host "Cleaning dist directory..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
        Write-Host "Dist directory cleaned!" -ForegroundColor Green
    }
}

function Test-TauriIcons {
    $iconPath = "src-tauri\icons"
    $requiredIcons = @("32x32.png", "128x128.png", "128x128@2x.png", "icon.icns", "icon.ico")
    
    if (Test-Path $iconPath) {
        $missingIcons = @()
        foreach ($icon in $requiredIcons) {
            if (-not (Test-Path "$iconPath\$icon")) {
                $missingIcons += $icon
            }
        }
        
        if ($missingIcons.Count -gt 0) {
            Write-Host "Missing Tauri icons: $($missingIcons -join ', ')" -ForegroundColor Yellow
            Write-Host "Please ensure all required icons exist in src-tauri/icons/" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "Tauri icons directory not found!" -ForegroundColor Red
        return $false
    }
    return $true
}

function Test-LicenseFile {
    if (-not (Test-Path "src-tauri\License.txt")) {
        Write-Host "License.txt not found in src-tauri/" -ForegroundColor Yellow
        Write-Host "Creating default License.txt..." -ForegroundColor Yellow
        "Copyright (c) 2026 Densync Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE." | Out-File -FilePath "src-tauri\License.txt" -Encoding UTF8
        Write-Host "License.txt created!" -ForegroundColor Green
    }
}

function Invoke-BuildWithRetry {
    param(
        [string]$BuildCommand,
        [int]$MaxRetries = 3
    )
    
    $retryCount = 0
    $success = $false
    
    while (-not $success -and $retryCount -lt $MaxRetries) {
        $retryCount++
        Write-Host "`nAttempt $retryCount of $MaxRetries: $BuildCommand" -ForegroundColor Cyan
        
        Invoke-Expression $BuildCommand
        $exitCode = $LASTEXITCODE
        
        if ($exitCode -eq 0) {
            Write-Host "Build succeeded!" -ForegroundColor Green
            $success = $true
        } else {
            Write-Host "Build failed with exit code $exitCode" -ForegroundColor Red
            
            # Analyze and fix common errors
            if ($BuildCommand -like "*npm*" -or $BuildCommand -like "*tauri*") {
                if ($retryCount -eq 1) {
                    Write-Host "`nAttempting automatic fixes..." -ForegroundColor Yellow
                    Set-ExecutionPolicyIfNeeded
                    Test-NodeModules
                    Test-DistDirectory
                    Test-LicenseFile
                    Test-TauriIcons
                }
            }
        }
    }
    
    return $success
}

# Main execution
Write-Host "=== Automated Build Error Detection and Fixing ===" -ForegroundColor Magenta
Write-Host ""

# Check execution policy first
Test-ExecutionPolicy

# Run the build command with automatic fixing
$success = Invoke-BuildWithRetry -BuildCommand $Command

if ($success) {
    Write-Host "`n=== Build completed successfully! ===" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n=== Build failed after $MaxRetries attempts ===" -ForegroundColor Red
    Write-Host "Please check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
