# Tether Labs Launch Thread (6 posts)

## Post 1
We published Experiment 01 from Tether Labs:
"AI agents don't fail consistently. They fail unpredictably."

AI agents are starting to take real actions (emails, CRM updates, workflows).  
We wanted to measure how they fail in the real world.

Read: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently

## Post 2
Experiment 01 question:
"What happens when an unsupervised AI agent gets email-writing access?"

We ran 19 realistic scenarios (PII, credentials, confidential strategy, wrong-recipient risk) across 5 runs.

## Post 3
What we found:
- ~21% of generated emails contained risky content
- 36% of risky scenarios leaked at least once
- Failures were not consistent; some scenarios were volatile

This is a control problem, not just a prompt problem.

Full write-up: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently

## Post 4
The scary part: many runs look safe.

If you only test once, you can think a system is fine.  
But repeated runs expose unstable behavior and intermittent leaks.

"No incident" is not the same as "safe."

## Post 5
We open-sourced the harness behind this:
- LLM agent wrapper
- scenario library
- risk analyzer
- single + batch experiment runners
- control-layer comparison logic

Repo: https://github.com/Tether-Labs/research

## Post 6
What next:
- Experiment 02: Supervised Agent
- model comparisons
- community scenarios

If you're building agents in production, we'd love your scenarios and feedback.
Read + share findings: https://tetherresearch.substack.com/p/ai-agents-dont-fail-consistently  
Contribute scenarios/code: https://github.com/Tether-Labs/research
