# Technical Foundation (recommended)

## Engine and gameplay layer

- **Client engine:** Unity 6 LTS (strong iteration speed + Steam ecosystem familiarity).
- **Language:** C#.
- **Netcode model:** Server-authoritative dedicated servers.

## Online architecture

- **Game servers:** .NET headless authoritative simulation servers.
- **Gateway/API:** ASP.NET Core (auth, profile, inventory, progression).
- **Data store:** PostgreSQL (accounts/progression) + Redis (session state/cache).
- **Infra:** Containerized services; start with one cloud region and autoscaling policies.

## Core systems to build first

1. Input + movement prediction/reconciliation.
2. Combat with server-side hit validation.
3. Procedural room graph generation.
4. Enemy director (spawn budgets by difficulty/time).
5. Drop generation and deterministic reward rolls.

## Steam path (long-term)

Per Steamworks documentation, initial milestones include:
- Steamworks partner onboarding.
- SDK integration.
- Build/depot setup.
- Store page and pricing configuration.
- Release review workflow.

## Week 1 execution checklist

- [ ] Create repository structure:
  - `/client`
  - `/server/game-sim`
  - `/server/api`
  - `/shared/contracts`
  - `/infra`
- [ ] Implement local dedicated server + one connectable client.
- [ ] Add deterministic tick loop and state snapshot broadcasting.
- [ ] Add PlayFab/Auth0/Firebase spike doc and choose one auth direction.
- [ ] Add CI pipeline for lint/test/build per module.

