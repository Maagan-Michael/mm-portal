param(
    [Parameter()]
    [string]
    [ValidateSet('full-install')]
    $Action
)

$helmVersion = "3.13.2"

function Install-Windows() {
    $helmVersion = (Invoke-WebRequest "https://api.github.com/repos/helm/helm/releases/latest" | ConvertFrom-Json)[0].tag_name
    Invoke-WebRequest -Uri "https://get.helm.sh/helm-v$helmVersion-windows-amd64.zip" -OutFile "helm.zip"
    Expand-Archive -Path "helm.zip" -DestinationPath "." -Force
    Remove-Item "helm.zip"
    $faasCliVersion = (Invoke-WebRequest "https://api.github.com/repos/openfaas/faas-cli/releases/latest" | ConvertFrom-Json)[0].tag_name
    Invoke-WebRequest -Uri "https://github.com/openfaas/faas-cli/releases/download/$faasCliVersion/faas-cli.exe" -OutFile "faas-cli.exe"
    Invoke-WebRequest -Uri "https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd6" -OutFile "kind.exe"
    $env:PATH = "$PSScriptRoot\tools;" + $env:PATH 
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
    heml repo update
}

function Create-Cluster() {
    kind create cluster --config=k8s/k8s-cluster.yml
    docker network connect "kind" "local-registry-1"
    kubectl apply -f k8s/k8s-registry-config.yml

    docker exec kind-control-plane mkdir /usr/share/ca-certificates/extra/
    docker cp registry/certs/host-docker.internal.crt kind-control-plane:/usr/share/ca-certificates/extra/host-docker.internal.crt
    docker exec kind-control-plane "echo 'extra/host-docker.internal.crt' | sudo tee -a /etc/ca-certificates.conf"
    docker exec kind-control-plane update-ca-certificates
    docker exec restart kind-control-plane
}

function Full-Install() {
    New-Item -ItemType Directory -Path "$PSScriptRoot\tools" -Force
    Push-Location "$PSScriptRoot\tools"
    try {
        if ($IsWindows) {
            Install-Windows
            Install-General-Prerequisites
            Create-Cluster
            Install-OpenFaas
        }
        else {
    
        }
    }
    finally {
        Pop-Location
    }
}

if ($Action -eq 'full-install') {
    Full-Install
}