param(
    [Parameter()]
    [string]
    [ValidateSet('full-install', 'cluster', 'openfaas')]
    $Action
)

$helmVersion = "3.13.2"

function Install-Windows() {
    New-Item -ItemType Directory -Path "$PSScriptRoot\tools" -Force
    Push-Location "$PSScriptRoot\tools"
    try {
        $helmVersion = (Invoke-WebRequest "https://api.github.com/repos/helm/helm/releases/latest" | ConvertFrom-Json)[0].tag_name
        Invoke-WebRequest -Uri "https://get.helm.sh/helm-$helmVersion-windows-amd64.zip" -OutFile "helm.zip"
        Expand-Archive -Path "helm.zip" -DestinationPath "." -Force
        $helmExe = Get-ChildItem -Path . -Recurse -Filter "helm.exe" 
        $helmExe | ForEach-Object { Move-Item $_.FullName "helm.exe" }
        Remove-Item "helm.zip"
        Remove-Item $helmExe.Directory.FullName -Recurse -Force
        $faasCliVersion = (Invoke-WebRequest "https://api.github.com/repos/openfaas/faas-cli/releases/latest" | ConvertFrom-Json)[0].tag_name
        Invoke-WebRequest -Uri "https://github.com/openfaas/faas-cli/releases/download/$faasCliVersion/faas-cli.exe" -OutFile "faas-cli.exe"
        Invoke-WebRequest -Uri "https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64" -OutFile "kind.exe"
        $env:PATH = "$PSScriptRoot\tools;" + $env:PATH 
    }
    finally {
        Pop-Location
    }
}

function Install-OpenFaas() {
    kubectl create namespace openfaas
    kubectl create namespace openfaas-fn
    helm upgrade openfaas --install openfaas/openfaas --namespace openfaas
    $password = kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}"
    [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($password)) | Out-File "password.txt"
}

function Install-General-Prerequisites() {
    helm repo add openfaas https://openfaas.github.io/faas-netes
    helm repo update
}

function Create-Cluster() {
    kind create cluster
    docker network connect "kind" "local-registry-1"
    kubectl apply -f k8s/k8s-registry-config.yml

    docker exec kind-control-plane mkdir /usr/share/ca-certificates/extra/
    docker cp registry/certs/host-docker.internal.crt kind-control-plane:/usr/share/ca-certificates/extra/host-docker.internal.crt
    docker exec -i kind-control-plane bash -c "echo 'extra/host-docker.internal.crt' | tee -a /etc/ca-certificates.conf"
    docker exec kind-control-plane update-ca-certificates
    docker restart kind-control-plane
    $nodes = kubectl get nodes -o json | ConvertFrom-Json
    while ((-not $nodes) -or (-not $nodes.items) -or $nodes.items.Length -eq 0) {
        Start-Sleep -Seconds 1
        $nodes = kubectl get nodes -o json | ConvertFrom-Json
    }
}

function Main() {
    if ($Action -eq 'full-install') {
        if ($IsWindows) {
            Install-Windows
        }
        else {
            
        }
        Install-General-Prerequisites
    }
    if ($Action -eq 'full-install' -or $Action -eq 'cluster') {
        Create-Cluster
    }
    if ($Action -eq 'full-install' -or $Action -eq 'openfaas') {
        Install-OpenFaas
    }
}

Main