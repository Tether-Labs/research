# Tether Labs Launch Threads

Ready-to-post copy for each experiment in the series. New threads added at the top.

---

## Experiment 03 — Enforcement (6 posts)

### Post 1
We told the agent what not to do.

It ignored us **17.5% of the time.**

So we stopped trusting it — and put a system around it instead.

New from Tether Labs: https://www.tether-labs.com/research/03-enforcement

### Post 2
The setup:
- Same 19 scenarios as Exp 02
- Same supervised `gpt-4o-mini` agent
- Same calibrated LLM judge (recipient-aware, content-not-topic, verbatim-evidence self-check)
- 15 runs × 19 scenarios × 2 modes = 570 emails

Only thing new: a decision node downstream of the judge.

### Post 3
Three layers, three numbers:
- Unsupervised: **53.3%** leak rate
- Supervised:  **17.5%** leak rate
- Supervised + enforcement: **0%** residual

The 0% is a plumbing check, not a finding — same judge fires the intervention and scores the outcome.

The real number is the next one.

### Post 4
**Intervention rate: 17.5%.**

For every 285 sends the agent attempts:
- 33 dropped (block)
- 17 queued for human approval
- 235 go through

To drive residual risk to zero, you intervene on 1 in 6 sends.

That's the operator workload of running this system.

### Post 5
The thesis:

> Reliability doesn't come from the model. It comes from the system around it.

Detection is observation. Enforcement is action. They are not the same layer.

The model generates. The system decides.

### Post 6
Reproducible end-to-end:
- Agent, scenarios, judge, enforcement runner: github.com/Tether-Labs/research
- `npm run experiment:batch:3`

Tell us what your intervention rate looks like on your workload — that's the next experiment we want to compare notes on.

Read: https://www.tether-labs.com/research/03-enforcement

---

## Experiment 01 — Unsupervised (6 posts)

### Post 1
We published Experiment 01 from Tether Labs:
"AI agents don't fail consistently. They fail unpredictably."

AI agents are starting to take real actions (emails, CRM updates, workflows).  
We wanted to measure how they fail in the real world.

Read: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently

### Post 2
Experiment 01 question:
"What happens when an unsupervised AI agent gets email-writing access?"

We ran 19 realistic scenarios (PII, credentials, confidential strategy, wrong-recipient risk) across 5 runs.

### Post 3
What we found:
- ~21% of generated emails contained risky content
- 36% of risky scenarios leaked at least once
- Failures were not consistent; some scenarios were volatile

This is a control problem, not just a prompt problem.

Full write-up: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently

### Post 4
The scary part: many runs look safe.

If you only test once, you can think a system is fine.  
But repeated runs expose unstable behavior and intermittent leaks.

"No incident" is not the same as "safe."

### Post 5
We open-sourced the harness behind this:
- LLM agent wrapper
- scenario library
- risk analyzer
- single + batch experiment runners
- control-layer comparison logic

Repo: https://github.com/Tether-Labs/research

### Post 6
What next:
- Experiment 02: Supervised Agent
- model comparisons
- community scenarios

If you're building agents in production, we'd love your scenarios and feedback.
Read + share findings: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently  
Contribute scenarios/code: https://github.com/Tether-Labs/research
