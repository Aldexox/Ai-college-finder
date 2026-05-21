$connections = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue |
  Where-Object { $_.OwningProcess -ne 0 }

if (-not $connections) {
  Write-Host "No process is using port 5000."
  exit 0
}

$processIds = $connections |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  Stop-Process -Id $processId -Force
  Write-Host "Stopped process $processId on port 5000."
}
