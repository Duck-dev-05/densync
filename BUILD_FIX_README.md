# Automated Build Error Detection and Fixing

This project includes an automated system to detect and fix common build errors, particularly when packages fail with exit code 1.

## Problem

The most common cause of build failures on Windows is PowerShell's execution policy blocking npm scripts:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

## Solution

### One-Time Setup

Run the setup script once to fix PowerShell execution policy:
```powershell
.\setup-build-fix.ps1
```

This sets the execution policy to `RemoteSigned` for your current user, allowing npm scripts to run.

### Automated Build with Error Fixing

Use the new npm scripts that include automatic error detection and fixing:

**For regular builds:**
```bash
npm run build:fix
```

**For Tauri builds:**
```bash
npm run tauri:build:fix
```

### What the Fix Script Does

The `fix-build-errors.ps1` script automatically:

1. **Checks PowerShell execution policy** - Updates it if needed
2. **Verifies node_modules** - Runs `npm install` if dependencies are missing
3. **Cleans dist directory** - Removes old build artifacts
4. **Checks Tauri icons** - Ensures all required icons exist
5. **Creates License.txt** - Adds a default license file if missing
6. **Retries with fixes** - Attempts the build up to 3 times with automatic fixes

### Manual Error Detection

You can also run the fix script with any command:
```powershell
.\fix-build-errors.ps1 -Command "npm run build"
```

## Common Issues Fixed

- **Exit code 1 from npm scripts** - Usually due to PowerShell execution policy
- **Missing node_modules** - Automatically installs dependencies
- **Stale build artifacts** - Cleans dist directory
- **Missing Tauri icons** - Detects missing icon files
- **Missing License.txt** - Creates default license file

## CI/CD Integration

The `.github/workflows/build.yml` workflow has been updated with automatic error detection and retry logic:

- **npm install** - Retries on failure
- **Python dependencies** - Retries torch, requirements, and pyinstaller installs
- **Tauri prerequisites check** - Validates configuration before build
- **Tauri build retry** - Automatically retries build on failure

The workflow uses `continue-on-error: true` to allow retry attempts before final failure.
