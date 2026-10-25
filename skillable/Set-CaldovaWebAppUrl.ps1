$ErrorActionPreference = "Stop"

$expectedSubscriptionId = "@lab.CloudSubscription.Id"
$resourceGroupName = "@lab.CloudResourceGroup(1).Name"
$context = Get-AzContext -ErrorAction Stop
if (-not $context -or $context.Subscription.Id -ne $expectedSubscriptionId) {
    throw "The cloud action is not using this lab's assigned Azure subscription."
}

$apps = @(Get-AzWebApp -ResourceGroupName $resourceGroupName -ErrorAction Stop |
    Where-Object { $_.Name -like "caldova-webapp-*" })
if ($apps.Count -ne 1) {
    throw "Expected exactly one Caldova web app in the assigned resource group; found $($apps.Count)."
}

$hostname = $apps[0].DefaultHostName
if ([string]::IsNullOrWhiteSpace($hostname) -or
    [Uri]::CheckHostName($hostname) -ne [UriHostNameType]::Dns -or
    -not $hostname.EndsWith(".azurewebsites.net", [StringComparison]::OrdinalIgnoreCase)) {
    throw "The deployed Caldova web app did not return a valid App Service hostname."
}

Set-LabVariable -Name CaldovaWebAppUrl -Value "https://$hostname"
