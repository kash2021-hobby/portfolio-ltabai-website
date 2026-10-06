# LTAB AI — QA launch plan, in plain words

**Who we are in this plan:** the independent, human-led QA partner for two kinds of software:

1. Apps **built with AI coding tools** (fast code, nobody has read it all).
2. Apps that **have AI features inside** (chatbots, copilots, search, summaries, agents).

**The offer in one line:** start with one fixed-scope sprint before release. Keep us monthly if it helps. Add deep AI checks when you need proof.

**The rule that never changes:** the client keeps the release decision. We bring evidence, risk and recommendations — never a "zero bugs" promise.

---

## Stage 1 — Win pilots · first 4–8 weeks

**What we sell: the Release Readiness QA Sprint.**
One app. One staging environment. About five critical user journeys. **5–10 working days.** Fixed scope.

**What the client gets (the whole list):**

- Core workflows tested, including failure paths
- API and integration checks where they exist
- Permissions, logins and error handling validated
- Exploratory testing beyond the happy path
- Browser, device and layout checks on the browsers that matter
- Basic performance and security checks, limits agreed up front
- A small regression suite for the most important flows
- One retest cycle after fixes
- A prioritized defect report with proof and repeat steps
- A release-risk summary a manager can read

**If the app has an AI feature, add the AI Feature Check:**

- Answers correct against sources the client approved
- Does it complete the user's task?
- Made-up answers ("hallucinations")
- Unsafe or refused outputs
- Prompt-injection tricks (people trying to bend the AI)
- Sensitive data leaking into answers
- Response speed and reliability

**Two rules that build trust:**

- Anything an AI tool generated (tests, findings) stays a **draft until a human QA professional signs it off**.
- An app merely *written* by AI, with no AI running inside, gets **ordinary QA** — no LLM evaluation needed. We don't sell what isn't required.

**Who we sell to first (pick one niche and stay there):** B2B SaaS teams shipping web AI assistants; agencies delivering AI-assisted builds; seed-to-Series B teams with no QA org. **Skip for now:** regulated, safety-critical and big-enterprise work.

**Stage-1 to-do list:** one-page service sheet + fixed-scope proposal template · sample defect report and risk report · one demo app (normal workflow + one AI feature) · reusable templates (risk, scenarios, AI rubrics, exec summary) · a written client-data policy (access, retention, deletion, anonymization) · a list of 20–30 prospects in the niche · sell 2–3 paid pilots (discount only for anonymized case-study rights) · measure defects found, critical findings, effort, turnaround, coverage, satisfaction.

**Move to stage 2 when:** several pilots delivered, effort estimates are accurate, and clients ask for release or regression support again.

---

## Stage 2 — Make it repeatable · months 2–9

**What we sell: Managed Release QA (monthly).**
Scoped by **releases, environments, workflows or reserved capacity** — never "unlimited tests".

**What the client gets each month:**

- New-feature testing for every agreed release
- A regression suite that stays maintained
- Exploratory testing on the riskiest changes
- API and integration validation
- Bug triage and fix verification
- AI evaluation re-runs whenever prompts, models, retrieval data or agent tools change
- A release-risk report
- A monthly quality review

**Three add-ons when demand shows:** AI Release Readiness Review (short pre-release assessment) · Continuous AI Quality Monitoring (scheduled quality, safety, latency, cost, drift checks) · AI-Generated Software Verification (independent testing of AI-written features).

**RAG systems:** retrieval quality, grounding, answer faithfulness, document freshness, end-to-end latency. **Agents add:** tool-choice accuracy, correct parameters, task completion, permission boundaries, recovery from tool failures, escalation to humans.

**How we grow accounts:** pilot → findings become a 30/60/90-day fix roadmap → 3-month subscription → highest-value checks into their CI/CD → monthly quality reviews with leaders → specialist AI testing only when evidence asks for it.

**The dashboard tracks outcomes, not test counts:** escaped critical defects · task-completion rate · grounded-answer rate · unsafe-response rate · flaky/false-positive rate · P50/P95/P99 latency · cost per AI interaction · coverage of critical journeys.

**Honesty rule:** we never promise a fixed defect or maintenance reduction. We compare like-for-like before and after, measured over weeks.

**Stage-2 to-do list:** pilots → written procedures · anonymized case studies with our own measured numbers · standard onboarding, access, reporting, escalation · fixed monthly tiers by releases/environments/workflows · versioned evaluation datasets · CI/CD + issue-tracker integration · partner with agencies, cloud and security consultants · train consultants to explain findings in business terms.

**Move to stage 3 when:** recurring contracts are profitable, delivery is consistent, and clients ask for deeper RAG, copilot or agent assurance.

---

## Stage 3 — Specialist AI assurance · months 9–18

**What we sell: AI Assurance & Evaluation** for complex AI products — a **reusable, versioned evaluation system**, not a one-time list of prompts.

**Every evaluation scenario records:** user intent and business context · input and retrieved context · expected behaviour (or acceptable range) · risk category · model/prompt/retrieval/app versions · scoring rubric and pass threshold · the response, trace, tool calls, latency and cost · reviewer decision and remediation status.

**Coverage:** RAG retrieval precision, recall, grounding, faithfulness, freshness · model and prompt comparison · hallucination and consistency · prompt injection, direct and indirect · privacy, authorization, cross-tenant leaks · toxicity, bias, unsafe outputs where relevant · agent tool selection and parameters · multi-step completion and recovery · human approval, interruption, rollback, auditability · latency and cost (P50/P95/P99) · drift in inputs, outputs, prompts, models and sources.

**Why it matters:** AI behaviour changes without a code change. Repeatable datasets and monitoring are the only honest answer.

**Stage-3 to-do list:** pick one defensible specialization (B2B RAG assistants or customer-service agents) · build the reusable harness + held-out benchmark set · pilot it with an existing recurring client · create an AI-assurance maturity model · build reusable red-team scenarios and failure taxonomies · stay model- and vendor-portable · quarterly assurance reviews for continuous-AI clients · productize the harness only after stable demand.

---

## The end state

LTAB AI = conventional QA + AI-assisted automation + independent assurance for LLM, RAG and agent systems. Commercially it stays simple: **sell a fixed-scope pilot, convert it into managed release QA, add high-value AI assurance when the evidence supports it.**

## The packages on the website (no prices shown, on purpose)

| Package | For | Time | In one line |
|---|---|---|---|
| **Release Readiness QA Sprint** | Anyone about to launch or hand over | 5–10 working days | One app, tested like a demanding customer; fix-list + risk read |
| **AI Feature Check** | Anyone shipping an AI feature | 3–5 working days | The AI tested like a skeptic; humans sign off every finding |
| **Managed Release QA** | Teams shipping every week or two | Monthly, scoped by releases | A testing team beside every release, AI re-checked when models change |
| **AI Assurance & Evaluation** | RAG assistants, copilots, agents | 2–4 weeks setup, then ongoing | Independent proof your AI does what it claims — and nothing it shouldn't |
