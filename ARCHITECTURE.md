# ControlPlane Architecture

## Runtime flow

```text
Enterprise AI / Agent
        |
        v
  +----------------+
  | Fast Risk      |
  | Screen         |
  +-------+--------+
          |
    +-----+-----+----------------+
    |           |                |
    v           v                v
Performance    Cost       Responsibility
 Engine        Engine          Engine
    |           |                |
    +-----------+----------------+
                |
                v
      Risk-Adaptive Decision
              Engine
                |
      +---------+---------+---------+
      |         |         |         |
      v         v         v         v
    ALLOW     REPAIR   ESCALATE   BLOCK
                         |
                         v
                  Human Review Queue
                         |
                         v
                     Audit Trail
```

## Key design choices

1. **Fast first, deep second.** Cheap screening prevents the governance layer from becoming a cost problem.
2. **Three risk dimensions.** Performance, cost and responsibility are evaluated independently so an enterprise can see why an answer is risky.
3. **Evidence-aware performance.** The prototype retrieves evidence from `data/knowledge` and compares the response with trusted context.
4. **Adaptive intervention.** The Decision Engine chooses ALLOW, REPAIR, ESCALATE or BLOCK rather than a binary pass/fail.
5. **Human-in-the-loop.** Escalated cases are placed into a review queue.
6. **Auditability.** Evaluations and decisions are persisted to the local demo store.
7. **LLM-optional architecture.** The system works without API credentials but can use any OpenAI-compatible chat endpoint through environment variables.
