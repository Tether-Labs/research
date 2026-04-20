---
name: Experiment 02 - Supervised Agent
about: Track implementation of supervised vs unsupervised experiment
title: "Experiment 02: Supervised Agent"
labels: ["experiment"]
assignees: []
---

## Goal

Measure whether explicit supervision instructions reduce risky outputs compared to the unsupervised baseline.

## Why this matters

A lot of teams assume "better instructions" are enough. We want to quantify how much supervision actually changes action safety.

## Scope

- [ ] Define supervised prompt variants
- [ ] Run baseline unsupervised pass
- [ ] Run supervised pass on same scenarios
- [ ] Compare leak rate, scenario exposure rate, and volatility
- [ ] Publish markdown + JSON report

## Success criteria

- Clear side-by-side metrics table
- At least one reproducible run config
- Report answers: "How much does supervision move outcomes?"
