param(
    [string]$BindHost = '127.0.0.1',
    [int]$Port = 8000,
    [switch]$NoReload
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-FreePort {
    param(
        [int]$StartPort,
        [int]$MaxAttempts = 20
    )

    for ($i = 0; $i -lt $MaxAttempts; $i++) {
        $Candidate = $StartPort + $i
        $Listener = $null
        try {
            $Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse('127.0.0.1'), $Candidate)
            $Listener.Start()
            $Listener.Stop()
            return $Candidate
        } catch {
            if ($Listener) {
                try { $Listener.Stop() } catch {}
            }
        }
    }

    throw "No free port found from $StartPort to $($StartPort + $MaxAttempts - 1)."
}

# Resolve repository and backend paths.
$RepoDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$BackendDir = Join-Path $RepoDir 'backend'
$VenvDir = Join-Path $BackendDir '.venv'
$ReqFile = Join-Path $BackendDir 'requirements.txt'
$VenvPython = Join-Path $VenvDir 'Scripts\python.exe'

if (-not (Test-Path $ReqFile)) {
    throw "requirements.txt not found: $ReqFile"
}

Write-Host '[1/5] Checking Python...'
$PythonCmd = $null
if (Get-Command py -ErrorAction SilentlyContinue) {
    $PythonCmd = 'py -3'
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $PythonCmd = 'python'
} else {
    throw 'Python is not installed. Please install Python 3.11+ and re-run this script.'
}

Set-Location $BackendDir

Write-Host "[2/5] Creating virtual environment at $VenvDir"
if ($PythonCmd -eq 'py -3') {
    py -3 -m venv $VenvDir
} else {
    python -m venv $VenvDir
}

if (-not (Test-Path $VenvPython)) {
    throw "Virtual environment python not found: $VenvPython"
}

Write-Host '[3/5] Upgrading pip/setuptools/wheel'
& $VenvPython -m pip install --upgrade pip setuptools wheel

Write-Host '[4/5] Installing backend dependencies'
& $VenvPython -m pip install -r $ReqFile

Write-Host '[5/5] Ensuring runtime folders exist'
$null = New-Item -ItemType Directory -Force -Path (Join-Path $BackendDir 'data\raw')
$null = New-Item -ItemType Directory -Force -Path (Join-Path $BackendDir 'data\processed')
$null = New-Item -ItemType Directory -Force -Path (Join-Path $BackendDir 'model\artifacts')

$SelectedPort = Get-FreePort -StartPort $Port
if ($SelectedPort -ne $Port) {
    Write-Host "Port $Port is busy. Using free port $SelectedPort instead."
}

$Args = @('-m', 'uvicorn', 'app.main:app', '--host', $BindHost, '--port', "$SelectedPort")
if (-not $NoReload) {
    $Args += '--reload'
}

Write-Host "Starting backend on http://$BindHost`:$SelectedPort ..."
& $VenvPython @Args
