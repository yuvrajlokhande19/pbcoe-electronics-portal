# PBCOE Portal page builder
# Assembles: _src/head.html + _pages/<name>.html + _src/foot.html -> <name>.html (project root)
# Each partial starts with: <!--TITLE:Page Title--> and optional <!--HEAD_EXTRA:<tags>-->
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot | Split-Path
$head = Get-Content "$root\_src\head.html" -Raw -Encoding UTF8
$foot = Get-Content "$root\_src\foot.html" -Raw -Encoding UTF8

Get-ChildItem "$root\_src\pages\*.html" | ForEach-Object {
    $name = $_.BaseName
    $body = Get-Content $_.FullName -Raw -Encoding UTF8

    $title = "PBCOE Electronics Portal"
    if ($body -match '<!--TITLE:(.+?)-->') { $title = $Matches[1] }
    $headExtra = ""
    if ($body -match '(?s)<!--HEAD_EXTRA:(.+?)-->') { $headExtra = $Matches[1]; $body = $body -replace '(?s)<!--HEAD_EXTRA:.+?-->', '' }

    $out = $head.Replace("%%TITLE%%", $title).Replace("%%HEAD_EXTRA%%", $headExtra) + $body + $foot
    Set-Content -Path "$root\$name.html" -Value $out -Encoding UTF8 -NoNewline
    Write-Host "built  $name.html  <-  $($_.Name)"
}
Write-Host "`nDone."
