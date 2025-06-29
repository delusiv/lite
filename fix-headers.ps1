# PowerShell script to fix project headers
$projectFiles = @(
    "asu.html",
    "sah.html", 
    "goat.html",
    "shitpost.html",
    "pj.html",
    "chatgpt.html",
    "portraits.html",
    "nami.html"
)

foreach ($file in $projectFiles) {
    $filePath = "projects\$file"
    if (Test-Path $filePath) {
        Write-Host "Processing $file..."
        
        # Read the content
        $content = Get-Content $filePath -Raw
        
        # Find the start of main content (after hardcoded header)
        $mainStart = $content.IndexOf('<main class="project-page">')
        if ($mainStart -gt 0) {
            # Extract the main content
            $mainContent = $content.Substring($mainStart)
            
            # Get the title from the original content
            $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
            $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "$file - Max Boissiere" }
            
            # Get the description from the original content
            $descMatch = [regex]::Match($content, '<meta name="description" content="(.*?)">')
            $description = if ($descMatch.Success) { $descMatch.Groups[1].Value } else { "Project by Max Boissiere" }
            
            # Create new content with correct header
            $newContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title</title>
    <meta name="description" content="$description">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        (function() {
            const savedTheme = localStorage.getItem('theme') || 
                (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', savedTheme);
        })();
    </script>
    <link rel="stylesheet" href="../style.css">
    <script src="../header-loader.js"></script>
</head>
<body>
    <div id="header-placeholder"></div>
    
    $mainContent
"@
            
            # Write the new content
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "Fixed $file"
        } else {
            Write-Host "Could not find main content in $file"
        }
    }
}

Write-Host "Header fixing complete!"
