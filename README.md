# Ask-Your-Database

A small 3-agent pipeline that turns a natural language question into a SQL query, validates it, runs it against a real Postgres database, and turns the result back into a plain-English answer.

Built as a hands-on learning project to understand structured LLM output, deterministic safety validation, and multi-step agent chaining — without a framework (no LangChain/LangGraph). Uses a local Ollama model via the OpenAI-compatible client.

## How it works

```
Question
     │
     ▼
[Agent 1] Generate SQL
  - Schema + relationships in system prompt
  - Few-shot examples (success + refusal cases)
  - Zod-enforced structured output: { success, error, query }
     │
     ▼
[Validation] Deterministic safety check
  - Must start with SELECT
  - Keyword check: DROP / DELETE / UPDATE / INSERT / ALTER / TRUNCATE / GRANT / REVOKE
  - Model's own success/error field is NOT trusted as the security boundary
     │
     ▼
[Execution] Run against Postgres
  - Read-only DB role (no write grants at all — enforced at the DB level, not just app code)
  - DB errors caught and returned as a clean failure, not a crash
     │
     ▼
[Agent 2] Generate Natural Language answer
  - Original question + query + result rows fed back into a second model call
  - Returns a plain-English answer, not a data dump
     │
     ▼
Answer
```

## Stack

- **Model**: local Ollama (`lfm2.5:8b`), OpenAI-compatible client
- **Backend**: Node.js, Express, TypeScript, OpenAI
- **DB**: PostgreSQL, `pg` driver, dedicated read-only role
- **Validation**: Zod (structured output enforcement)
- **Frontend**: React + Vite, minimal terminal-style UI

## Security model

The actual safety boundary is the **Postgres read-only role**, not the app-level regex check. The DB user this app connects with has `SELECT` grants only — no INSERT/UPDATE/DELETE/DROP, full stop. This was verified manually: a hardcoded `DELETE` against the role throws a Postgres permission error before the app-level validation even matters.

The regex/allowlist check in the app is a second layer — it exists to fail fast with a clean error message, not to be the thing standing between a bad query and the data.

## Known limitations (deliberately deferred, not fixed)

This was built as a learning exercise, not a production system. Left unresolved on purpose:

- **Statement stacking**: `SELECT ...; DROP ...` isn't blocked by the current validator. The read-only role would still stop the destructive half from executing, but the validator itself doesn't catch it.
- **No column-level restriction**: nothing stops a generated query from selecting the `password` column via `SELECT *`. Not filtered in the prompt or in code.
- **No retry logic**: if the model generates invalid SQL that fails at execution, the request fails — there's no automatic retry with the DB error fed back into a second generation attempt.
- **Model reliability**: `lfm2.5:8b` is a small general-purpose model, not SQL-specialized. It handles single-table queries and simple joins reasonably well with the current few-shot examples, but can still hallucinate columns/tables or apply the wrong aggregation function on more unusual phrasing.

## Setup

1. Create a Postgres read-only role:
   ```sql
   CREATE ROLE app_readonly WITH LOGIN PASSWORD 'yourpassword';
   GRANT CONNECT ON DATABASE your_db TO app_readonly;
   GRANT USAGE ON SCHEMA public TO app_readonly;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
   ```
2. Set `DATABASE_URL` in `.env` to the read-only role's connection string.
3. Confirm Ollama is running locally with the model pulled (`ollama pull lfm2.5:8b`).
4. `npm install && npm run build && npm start` for the backend.
5. `npm install && npm run dev` for the frontend (set `VITE_BACKEND_URL` if not using `localhost:8000`).

## Status

Backend pipeline works end-to-end. Frontend is a minimal demo UI, not a production interface. This is a closed learning project — not deployed, not intended to be.
