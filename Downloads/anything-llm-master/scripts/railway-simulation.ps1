# Railway Deployment Simulation Script
# This script simulates Railway deployment and identifies potential issues

param(
    [switch]$FullSimulation,
    [switch]$DockerTest,
    [switch]$DependencyCheck,
    [switch]$EnvironmentTest,
    [switch]$RailwaySimulation
)

Write-Host "🚂 Railway Deployment Simulation Started" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to simulate Railway environment
function Test-RailwayEnvironment {
    Write-Host "`n🔍 Testing Railway Environment Compatibility..." -ForegroundColor Yellow
    
    # Check Node.js version compatibility
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
        
        # Check if version is compatible with Railway
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -ge 18) {
            Write-Host "✅ Node.js version compatible with Railway" -ForegroundColor Green
        } else {
            Write-Host "❌ Node.js version too old for Railway (requires 18+)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Node.js not found" -ForegroundColor Red
    }
    
    # Check Yarn
    if (Test-Command "yarn") {
        $yarnVersion = yarn --version
        Write-Host "✅ Yarn version: $yarnVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Yarn not found" -ForegroundColor Red
    }
    
    # Check if we're in a Git repository
    if (Test-Path ".git") {
        Write-Host "✅ Git repository detected" -ForegroundColor Green
    } else {
        Write-Host "❌ Not in a Git repository" -ForegroundColor Red
    }
}

# Function to test Docker build
function Test-DockerBuild {
    Write-Host "`n🐳 Testing Docker Build..." -ForegroundColor Yellow
    
    if (-not (Test-Command "docker")) {
        Write-Host "❌ Docker not available" -ForegroundColor Red
        return
    }
    
    Write-Host "✅ Docker available" -ForegroundColor Green
    
    # Test Dockerfile syntax
    try {
        docker build --dry-run -f docker/Dockerfile.optimized . 2>&1 | Out-Null
        Write-Host "✅ Dockerfile syntax valid" -ForegroundColor Green
    } catch {
        Write-Host "❌ Dockerfile syntax error" -ForegroundColor Red
    }
    
    # Check if all required files exist
    $requiredFiles = @(
        "docker/Dockerfile.optimized",
        "docker/docker-entrypoint.sh",
        "docker/docker-healthcheck.sh",
        "docker/.env.example",
        "package.json",
        "server/package.json",
        "frontend/package.json",
        "collector/package.json"
    )
    
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file exists" -ForegroundColor Green
        } else {
            Write-Host "❌ $file missing" -ForegroundColor Red
        }
    }
}

# Function to check dependencies
function Test-Dependencies {
    Write-Host "`n📦 Testing Dependencies..." -ForegroundColor Yellow
    
    # Check root dependencies
    if (Test-Path "package.json") {
        Write-Host "✅ Root package.json exists" -ForegroundColor Green
        
        # Check if yarn.lock exists
        if (Test-Path "yarn.lock") {
            Write-Host "✅ yarn.lock exists" -ForegroundColor Green
        } else {
            Write-Host "⚠️  yarn.lock missing - will be generated" -ForegroundColor Yellow
        }
    }
    
    # Check server dependencies
    if (Test-Path "server/package.json") {
        Write-Host "✅ Server package.json exists" -ForegroundColor Green
        
        # Check for critical server dependencies
        $serverPackage = Get-Content "server/package.json" | ConvertFrom-Json
        $criticalDeps = @("express", "prisma", "@prisma/client")
        
        foreach ($dep in $criticalDeps) {
            if ($serverPackage.dependencies.$dep -or $serverPackage.devDependencies.$dep) {
                Write-Host "✅ Server dependency $dep found" -ForegroundColor Green
            } else {
                Write-Host "❌ Server dependency $dep missing" -ForegroundColor Red
            }
        }
    }
    
    # Check frontend dependencies
    if (Test-Path "frontend/package.json") {
        Write-Host "✅ Frontend package.json exists" -ForegroundColor Green
        
        $frontendPackage = Get-Content "frontend/package.json" | ConvertFrom-Json
        $criticalDeps = @("react", "vite")
        
        foreach ($dep in $criticalDeps) {
            if ($frontendPackage.dependencies.$dep -or $frontendPackage.devDependencies.$dep) {
                Write-Host "✅ Frontend dependency $dep found" -ForegroundColor Green
            } else {
                Write-Host "❌ Frontend dependency $dep missing" -ForegroundColor Red
            }
        }
    }
}

# Function to test environment variables
function Test-EnvironmentVariables {
    Write-Host "`n🌍 Testing Environment Variables..." -ForegroundColor Yellow
    
    # Check .env.example
    if (Test-Path "docker/.env.example") {
        Write-Host "✅ .env.example exists" -ForegroundColor Green
        
        $envContent = Get-Content "docker/.env.example"
        $requiredVars = @("DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY")
        
        foreach ($var in $requiredVars) {
            if ($envContent -match $var) {
                Write-Host "✅ Environment variable $var defined" -ForegroundColor Green
            } else {
                Write-Host "❌ Environment variable $var missing" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ .env.example missing" -ForegroundColor Red
    }
    
    # Check server .env.example
    if (Test-Path "server/.env.example") {
        Write-Host "✅ Server .env.example exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Server .env.example missing" -ForegroundColor Red
    }
}

# Function to simulate Railway deployment
function Test-RailwayDeployment {
    Write-Host "`n🚂 Simulating Railway Deployment..." -ForegroundColor Yellow
    
    # Check for Railway-specific files
    $railwayFiles = @(
        "railway.json",
        "railway.toml",
        ".railwayignore"
    )
    
    foreach ($file in $railwayFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file exists" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $file missing (optional)" -ForegroundColor Yellow
        }
    }
    
    # Check build scripts
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.scripts.build) {
        Write-Host "✅ Build script defined" -ForegroundColor Green
    } else {
        Write-Host "❌ Build script missing" -ForegroundColor Red
    }
    
    if ($packageJson.scripts.start) {
        Write-Host "✅ Start script defined" -ForegroundColor Green
    } else {
        Write-Host "❌ Start script missing" -ForegroundColor Red
    }
    
    # Check for port configuration
    if ($packageJson.scripts.start -match "3001") {
        Write-Host "✅ Port 3001 configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Port configuration unclear" -ForegroundColor Yellow
    }
}

# Function to test build process
function Test-BuildProcess {
    Write-Host "`n🔨 Testing Build Process..." -ForegroundColor Yellow
    
    # Test frontend build
    if (Test-Path "frontend") {
        Set-Location "frontend"
        
        if (Test-Command "yarn") {
            try {
                Write-Host "Testing frontend build..." -ForegroundColor Cyan
                yarn build:ci 2>&1 | Out-Null
                Write-Host "✅ Frontend build successful" -ForegroundColor Green
            } catch {
                Write-Host "❌ Frontend build failed" -ForegroundColor Red
            }
        }
        
        Set-Location ".."
    }
    
    # Check if dist folder was created
    if (Test-Path "frontend/dist") {
        Write-Host "✅ Frontend dist folder created" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend dist folder missing" -ForegroundColor Red
    }
}

# Function to check database configuration
function Test-DatabaseConfig {
    Write-Host "`n🗄️ Testing Database Configuration..." -ForegroundColor Yellow
    
    # Check Prisma schema
    if (Test-Path "server/prisma/schema.prisma") {
        Write-Host "✅ Prisma schema exists" -ForegroundColor Green
        
        $schemaContent = Get-Content "server/prisma/schema.prisma"
        
        # Check database provider
        if ($schemaContent -match "provider = \"sqlite\"") {
            Write-Host "✅ SQLite provider configured" -ForegroundColor Green
        } elseif ($schemaContent -match "provider = \"postgresql\"") {
            Write-Host "✅ PostgreSQL provider configured" -ForegroundColor Green
        } else {
            Write-Host "❌ Database provider not configured" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Prisma schema missing" -ForegroundColor Red
    }
    
    # Check migrations
    if (Test-Path "server/prisma/migrations") {
        $migrations = Get-ChildItem "server/prisma/migrations" -Directory
        Write-Host "✅ Found $($migrations.Count) migrations" -ForegroundColor Green
    } else {
        Write-Host "❌ No migrations found" -ForegroundColor Red
    }
}

# Function to generate Railway configuration
function New-RailwayConfig {
    Write-Host "`n⚙️ Generating Railway Configuration..." -ForegroundColor Yellow
    
    # Create railway.json
    $railwayConfig = @{
        build = @{
            builder = "NIXPACKS"
        }
        deploy = @{
            startCommand = "cd server && npm start"
            healthcheckPath = "/api/system/health"
            healthcheckTimeout = 300
            restartPolicyType = "ON_FAILURE"
            restartPolicyMaxRetries = 10
        }
    } | ConvertTo-Json -Depth 3
    
    $railwayConfig | Out-File -FilePath "railway.json" -Encoding UTF8
    Write-Host "✅ railway.json created" -ForegroundColor Green
    
    # Create Procfile for Railway
    $procfile = "web: cd server && npm start"
    $procfile | Out-File -FilePath "Procfile" -Encoding UTF8
    Write-Host "✅ Procfile created" -ForegroundColor Green
    
    # Create .railwayignore
    $ignoreContent = @"
node_modules/
.git/
*.log
.env
.env.local
.env.development
.env.test
.env.production
coverage/
.nyc_output/
dist/
build/
*.tgz
*.tar.gz
"@
    
    $ignoreContent | Out-File -FilePath ".railwayignore" -Encoding UTF8
    Write-Host "✅ .railwayignore created" -ForegroundColor Green
}

# Main execution
if ($FullSimulation -or $DockerTest) {
    Test-DockerBuild
}

if ($FullSimulation -or $DependencyCheck) {
    Test-Dependencies
}

if ($FullSimulation -or $EnvironmentTest) {
    Test-EnvironmentVariables
}

if ($FullSimulation -or $RailwaySimulation) {
    Test-RailwayEnvironment
    Test-RailwayDeployment
    Test-DatabaseConfig
    New-RailwayConfig
}

if ($FullSimulation) {
    Test-BuildProcess
}

Write-Host "`n🎯 Railway Simulation Complete!" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Fix any issues identified above" -ForegroundColor White
Write-Host "2. Run: railway login" -ForegroundColor White
Write-Host "3. Run: railway init" -ForegroundColor White
Write-Host "4. Run: railway up" -ForegroundColor White
