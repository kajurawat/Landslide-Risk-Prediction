param(
    [string]$BindHost = '127.0.0.1',
    [int]$Port = 5173
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-FreePort {
    param(
        [string]$BindAddress,
        [int]$StartPort,
        [int]$MaxAttempts = 20
    )

    $ProbeAddress = $null
    if ([string]::IsNullOrWhiteSpace($BindAddress) -or $BindAddress -eq '0.0.0.0') {
        $ProbeAddress = [System.Net.IPAddress]::Any
    }
    elseif ($BindAddress -eq 'localhost') {
        $ProbeAddress = [System.Net.IPAddress]::Loopback
    }
    else {
        try {
            $ProbeAddress = [System.Net.IPAddress]::Parse($BindAddress)
        }
        catch {
            throw "Invalid bind host '$BindAddress'. Use localhost, 0.0.0.0, or a valid IP address."
        }
    }

    for ($i = 0; $i -lt $MaxAttempts; $i++) {
        $Candidate = $StartPort + $i
        $Listener = $null
        try {
            $Listener = [System.Net.Sockets.TcpListener]::new($ProbeAddress, $Candidate)
            $Listener.Start()
            $Listener.Stop()
            return $Candidate
        }
        catch {
            if ($Listener) {
                try { $Listener.Stop() } catch {}
            }
        }
    }

    throw "No free port found from $StartPort to $($StartPort + $MaxAttempts - 1)."
}

$RepoDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$FrontendDir = Join-Path $RepoDir 'frontend'
$PackageJson = Join-Path $FrontendDir 'package.json'
$LockFile = Join-Path $FrontendDir 'package-lock.json'
$EnvFile = Join-Path $FrontendDir '.env'

if (-not (Test-Path $PackageJson)) {
    throw "frontend/package.json not found: $PackageJson"
}

Write-Host '[1/4] Checking Node.js and npm...'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js is not installed. Please install Node.js 18+ and re-run this script.'
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw 'npm is not installed or not on PATH. Please install Node.js/npm and re-run this script.'
}

Set-Location $FrontendDir

Write-Host '[2/4] Installing frontend dependencies...'
if (Test-Path $LockFile) {
    npm ci
}
else {
    npm install
}

Write-Host '[3/4] Ensuring frontend .env exists...'
if (-not (Test-Path $EnvFile)) {
    @(
        'VITE_API_BASE_URL=http://127.0.0.1:8000',
        'VITE_API_BASE_URL_FOR_DATASET=http://127.0.0.1:8000/api/v1/data'
    ) | Set-Content -Path $EnvFile -Encoding UTF8
}

$SelectedPort = Get-FreePort -BindAddress $BindHost -StartPort $Port
if ($SelectedPort -ne $Port) {
    Write-Host "Port $Port is busy. Using free port $SelectedPort instead."
}

Write-Host "[4/4] Starting frontend on http://$BindHost`:$SelectedPort ..."
npm run dev -- --host $BindHost --port $SelectedPort
