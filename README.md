# Caldova Retail Ops

Caldova Retail Co. designs and sells gear for trail, camp, and everyday
adventure. This repository is the storefront and lightweight operations
dashboard our team uses to browse the product catalog, search for items,
review daily sales, and manage checkout and recommendations.

## Architecture

- **Backend**: ASP.NET Core Web API (C#, `net8.0`), minimal APIs.
- **Frontend**: Static HTML/CSS/JS served from `wwwroot/`, calling the
  backend's JSON endpoints.
- Both are hosted together as a single ASP.NET Core app.

## Running locally

```powershell
dotnet run
```

Then open `http://localhost:5000` (or the URL printed on startup).

## Features

- **Catalog** — browse the full product catalog in a paginated table, or
  search for a product by name.
- **Checkout** — view a simulated order confirmation.
- **Reports** — daily sales summaries.
- **Recommendations** — personalized product suggestions for a given
  customer.
- **About / Contact** — general store information.

## API endpoints

| Route                                   | Description                          |
|------------------------------------------|----------------------------------------|
| `GET /api/health`                        | Liveness check                        |
| `GET /api/status`                        | Uptime and runtime info               |
| `GET /api/checkout`                      | Simulated checkout                    |
| `GET /api/search?page=`                  | Paginated catalog browse              |
| `GET /api/search/by-name?name=&page=`    | Search the catalog by product name    |
| `GET /api/reports?day=`                  | Daily sales report (1=Mon ... 7=Sun)  |
| `GET /api/recommendations?customerId=`   | Personalized recommendations          |
| `GET /api/ping`                          | Simple liveness/load endpoint         |
| `GET /api/version`                       | Service/runtime version info          |
| `GET /api/store-locator?zip=`            | Nearby store lookup                   |
| `GET /api/inventory-summary`             | Warehouse inventory summary           |

## About Azure SRE Agent

[Azure SRE Agent](https://learn.microsoft.com/en-us/azure/sre-agent/) is an
AI-powered reliability assistant that helps teams keep their applications
healthy with far less manual effort. It continuously monitors your Azure
resources, investigates issues using logs, metrics, and source code, identifies
root causes, and recommends or applies mitigations with your approval. By
automating routine diagnostics, alert triage, and operational tasks, it helps
teams move toward a **zero-ops** model, so engineers can spend less time
firefighting and more time building.

## About the lab

This lab was created by **Puneet Gupta** (Principal Software Engineer) and
**Shamir Abdul Aziz**, with help from Azure SRE Agent.

- [Puneet Gupta](https://www.linkedin.com/in/meetpuneetg)
- [Shamir Abdul Aziz](https://www.linkedin.com/in/meetshamir/)

We'd love to hear how you're using Azure SRE Agent. If you're planning to
adopt it or would like guidance on setting it up for your own environment,
please reach out to us on LinkedIn. We're happy to help you get started.
