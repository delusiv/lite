# PowerShell script to update all HTML navigation links
$projectFiles = Get-ChildItem "e:\Max\website-maxboissiere\lite\projects\*.html"

foreach ($file in $projectFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace all ../index.html with ../
    $content = $content -replace 'href="../index\.html"', 'href="../"'
    
    # Replace project links with extensionless versions
    $content = $content -replace 'href="([^"]*?)\.html"', 'href="$1"'
    
    # Write back to file
    Set-Content $file.FullName -Value $content -NoNewline
    
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All project files updated successfully!"
