param([ValidateSet('baseline','hardened','ambos')][string]$Etapa='ambos')
$ErrorActionPreference='Stop'
Set-Location $PSScriptRoot
$env:PROMPTFOO_DISABLE_TELEMETRY='1'
$env:PROMPTFOO_CONFIG_DIR=Join-Path $PSScriptRoot '.promptfoo'
$env:npm_config_cache=Join-Path $PSScriptRoot 'tools/npm-cache'
New-Item -ItemType Directory -Force resultados | Out-Null
$etapas=if ($Etapa -eq 'ambos') {@('baseline','hardened')} else {@($Etapa)}
foreach ($e in $etapas) {
  & npm.cmd exec --yes --package=promptfoo@0.126.0 -- promptfoo eval -c "$e.yaml" --max-concurrency 1 --no-cache --no-share -o "resultados/$e.json" -o "resultados/$e.html"
  if ($LASTEXITCODE -notin @(0,100)) { Write-Warning "Revisar la salida y distinguir fallos de aserción de errores de ejecución. Código: $LASTEXITCODE" }
}
