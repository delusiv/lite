# PowerShell script to remove top back-links from project files
$projectFiles = Get-ChildItem -Path "projects" -Filter "*.html"

foreach ($file in $projectFiles) {
    Write-Host "Processing $($file.Name)..."
    
    # Read all lines
    $lines = Get-Content $file.FullName
    $newLines = @()
    $skipLines = $false
    $lineCount = 0
    
    foreach ($line in $lines) {
        $lineCount++
        
        # Check if this is the start of a back-link right after main tag
        if ($line -match '^\s*<a href="../index\.html" class="back-link">') {
            # Check if the previous few lines contain <main class="project-page">
            $foundMain = $false
            for ($i = [Math]::Max(0, $newLines.Count - 5); $i -lt $newLines.Count; $i++) {
                if ($newLines[$i] -match '<main class="project-page">') {
                    $foundMain = $true
                    break
                }
            }
            
            if ($foundMain) {
                $skipLines = $true
                Write-Host "Found top back-link at line $lineCount in $($file.Name)"
                continue
            }
        }
        
        # Skip lines until we find the closing </a> tag of the back-link
        if ($skipLines) {
            if ($line -match '</a>\s*$') {
                $skipLines = $false
                Write-Host "Skipped back-link ending at line $lineCount"
            }
            continue
        }
        
        $newLines += $line
    }
    
    # Write the modified content back
    if ($newLines.Count -ne $lines.Count) {
        $newLines | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "Removed top back-link from $($file.Name)"
    } else {
        Write-Host "No changes made to $($file.Name)"
    }
}

Write-Host "Back-link removal complete!"
