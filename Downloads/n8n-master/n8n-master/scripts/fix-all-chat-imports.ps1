# Script PowerShell pour corriger TOUS les imports @workflow-automation/chat dans le package chat
$chatSrcPath = Join-Path $PSScriptRoot "..\packages\frontend\@n8n\chat\src"
$files = Get-ChildItem -Path $chatSrcPath -Recurse -Include *.vue,*.ts,*.mts,*.js,*.mjs

$totalFiles = 0
$modifiedFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $totalFiles++
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileReplacements = 0
    
    # Pattern 1: import DefaultName from "@workflow-automation/chat"
    if ($content -match 'import\s+(\w+)\s+from\s+["'']@workflow-automation/chat["'']') {
        $importName = $matches[1]
        $relativePath = ""
        
        # Calculer le chemin relatif depuis le fichier vers le composant
        $fileDir = $file.DirectoryName
        $componentPath = Join-Path $chatSrcPath "components\$importName.vue"
        $componentIndexPath = Join-Path $chatSrcPath "components\index.ts"
        
        if (Test-Path $componentPath) {
            $relativePath = Resolve-Path -Path $componentPath -Relative
            $relativePath = $relativePath -replace '\\', '/'
            if (-not $relativePath.StartsWith('.')) {
                $relativePath = "./$relativePath"
            }
        } elseif (Test-Path $componentIndexPath) {
            $relativePath = Resolve-Path -Path $componentIndexPath -Relative
            $relativePath = $relativePath -replace '\\', '/'
            if (-not $relativePath.StartsWith('.')) {
                $relativePath = "./$relativePath"
            }
        } else {
            $indexPath = Join-Path $chatSrcPath "index.ts"
            $relativePath = Resolve-Path -Path $indexPath -Relative
            $relativePath = $relativePath -replace '\\', '/'
            if (-not $relativePath.StartsWith('.')) {
                $relativePath = "./$relativePath"
            }
        }
        
        $content = $content -replace "import\s+$importName\s+from\s+[""']@workflow-automation/chat[""']", "import $importName from `"$relativePath`""
        $fileReplacements++
    }
    
    # Pattern 2: import { Name } from "@workflow-automation/chat"
    if ($content -match 'import\s+\{([^}]+)\}\s+from\s+["'']@workflow-automation/chat["'']') {
        $imports = $matches[1]
        $relativePath = ""
        
        $indexPath = Join-Path $chatSrcPath "index.ts"
        $relativePath = Resolve-Path -Path $indexPath -Relative
        $relativePath = $relativePath -replace '\\', '/'
        if (-not $relativePath.StartsWith('.')) {
            $relativePath = "./$relativePath"
        }
        
        $content = $content -replace 'import\s+\{([^}]+)\}\s+from\s+["'']@workflow-automation/chat["'']', "import {$imports} from `"$relativePath`""
        $fileReplacements++
    }
    
    # Pattern 3: import * as Name from "@workflow-automation/chat"
    if ($content -match 'import\s+\*\s+as\s+(\w+)\s+from\s+["'']@workflow-automation/chat["'']') {
        $importName = $matches[1]
        $relativePath = ""
        
        $indexPath = Join-Path $chatSrcPath "index.ts"
        $relativePath = Resolve-Path -Path $indexPath -Relative
        $relativePath = $relativePath -replace '\\', '/'
        if (-not $relativePath.StartsWith('.')) {
            $relativePath = "./$relativePath"
        }
        
        $content = $content -replace 'import\s+\*\s+as\s+\w+\s+from\s+["'']@workflow-automation/chat["'']', "import * as $importName from `"$relativePath`""
        $fileReplacements++
    }
    
    # Pattern 4: import Name from "@workflow-automation/chat/subpath"
    $content = $content -replace '["'']@workflow-automation/chat/([^"'']+)["'']', {
        param($match)
        $subpath = $match.Groups[1].Value
        $subpath = $subpath -replace '^src/', ''
        
        $targetPath = Join-Path $chatSrcPath $subpath
        if (-not (Test-Path $targetPath)) {
            $targetPath = "$targetPath.ts"
        }
        if (-not (Test-Path $targetPath)) {
            $targetPath = Join-Path (Join-Path $chatSrcPath (Split-Path $subpath -Parent)) "index.ts"
        }
        
        if (Test-Path $targetPath) {
            $relativePath = Resolve-Path -Path $targetPath -Relative
            $relativePath = $relativePath -replace '\\', '/'
            if (-not $relativePath.StartsWith('.')) {
                $relativePath = "./$relativePath"
            }
            $fileReplacements++
            return "`"$relativePath`""
        }
        return $match.Value
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $modifiedFiles++
        $totalReplacements += $fileReplacements
        Write-Host "✅ Corrigé: $($file.FullName) ($fileReplacements remplacements)"
    }
}

Write-Host "`n✅ Correction terminée!"
Write-Host "   Fichiers traités: $totalFiles"
Write-Host "   Fichiers modifiés: $modifiedFiles"
Write-Host "   Total de remplacements: $totalReplacements"

