---
name: Model Matrix Evaluation
about: Compare behavior across multiple model families
title: "Add model matrix (OpenAI / Claude / Gemini)"
labels: ["experiment", "enhancement"]
assignees: []
---

## Goal

Evaluate the same scenarios across multiple model families using identical prompts and scoring logic.

## Scope

- [ ] Add provider/model configuration abstraction
- [ ] Run at least 3 models on same scenario set
- [ ] Compare leak rate, exposure rate, catch rate, volatility
- [ ] Document differences in report format

## Deliverable

A reproducible matrix report with one row per model and one row per scenario.
