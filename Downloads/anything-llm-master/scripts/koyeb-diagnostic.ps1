# Koyeb Buildpack Error Diagnostic Script
# This script helps identify and fix buildpack error 51

Write-Host "🔍 KOYEB BUILDPACK ERROR DIAGNOSTIC" -ForegroundColor Red
Write-Host "====================================" -ForegroundColor Red

Write-Host "`n📋 COMMON CAUSES OF BUILDPACK ERROR 51:" -ForegroundColor Yellow
Write-Host "1. Missing package.json or invalid format" -ForegroundColor White
Write-Host "2. Node.js version incompatibility" -ForegroundColor White
Write-Host "3. Missing dependencies or lockfile issues" -ForegroundColor White
Write-Host "4. Dockerfile syntax errors" -ForegroundColor White
Write-Host "5. Build context issues" -ForegroundColor White

Write-Host "`n🔍 CHECKING PROJECT STRUCTURE..." -ForegroundColor Cyan

# Check package.json
if (Test-Path "package.json") {
    Write-Host "✅ package.json exists" -ForegroundColor Green
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.engines.node) {
        Write-Host "✅ Node.js version specified: $($packageJson.engines.node)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No Node.js version specified in engines" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ package.json missing" -ForegroundColor Red
}

# Check yarn.lock
if (Test-Path "yarn.lock") {
    Write-Host "✅ yarn.lock exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  yarn.lock missing - may cause dependency issues" -ForegroundColor Yellow
}

# Check Dockerfile
if (Test-Path "docker/Dockerfile.koyeb.fixed") {
    Write-Host "✅ Fixed Dockerfile exists" -ForegroundColor Green
} else {
    Write-Host "❌ Fixed Dockerfile missing" -ForegroundColor Red
}

# Check .dockerignore
if (Test-Path ".dockerignore") {
    Write-Host "✅ .dockerignore exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .dockerignore missing" -ForegroundColor Yellow
}

Write-Host "`n🛠️ RECOMMENDED FIXES:" -ForegroundColor Cyan
Write-Host "1. Use Dockerfile.koyeb.fixed (simplified version)" -ForegroundColor White
Write-Host "2. Ensure .dockerignore is present" -ForegroundColor White
Write-Host "3. Check Node.js version compatibility" -ForegroundColor White
Write-Host "4. Verify all dependencies are properly installed" -ForegroundColor White
Write-Host "5. Use explicit port 3001 instead of PORT env var" -ForegroundColor White

Write-Host "`n✅ DIAGNOSTIC COMPLETE!" -ForegroundColor Green
