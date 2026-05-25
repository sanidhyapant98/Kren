# Project Identity

Build a minimal concurrent worker pool from scratch using modern TypeScript primitives.

This project exists to deeply understand:

- concurrency
- scheduling
- worker orchestration
- retries
- timeouts
- cancellation
- overload handling

This is a systems learning project.

NOT a production queue.

NOT a startup.

NOT infrastructure engineering.

The goal is understanding execution mechanics.

---

# Core Mental Model

```txt
Producer
   ↓
FIFO Queue
   ↓
Worker Pool
   ↓
Concurrent Execution
   ↓
Task Lifecycle Management
````

Everything in this project revolves around controlled concurrent execution.

---

# Tech Stack

## Runtime

* Bun (latest stable)

---

## Language

* TypeScript (strict mode)

Required:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Allowed Primitives

Use ONLY:

* Promise
* async/await
* AbortController
* EventEmitter
* native timers
* arrays/maps/sets

No concurrency libraries.

No queue libraries.

No worker libraries.

---

# Hard Constraints

## Everything is In-Memory

No:

* Redis
* databases
* persistence
* files
* networking

Reason:
focus entirely on concurrency mechanics.

---

## Single Process Only

No:

* clustering
* distributed workers
* multi-process orchestration

That belongs later.

---

# Learning Goals

By the end, deeply understand:

* why queues exist
* bounded concurrency
* worker lifecycle management
* task orchestration
* overload protection
* cancellation semantics
* timeout enforcement
* retry amplification
* scheduling tradeoffs

These are foundational distributed systems concepts.

---

# System Components

## Task

A task represents executable work.

```ts
type TaskState =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "timed_out"
```

```ts
type Task = {
  id: string
  payload: unknown
  retries: number
  maxRetries: number
  timeoutMs: number
  state: TaskState
  createdAt: number
}
```

---

## FIFO Queue

Simple first-in-first-out queue.

Responsibilities:

* enqueue task
* dequeue task
* queue size tracking
* queue limit enforcement

Required behavior:

```txt
maxQueueSize = 100
```

Reject new tasks when full.

This teaches backpressure.

---

## Worker

A worker continuously polls the queue and executes tasks.

Worker states:

```ts
type WorkerState =
  | "idle"
  | "busy"
  | "stopped"
```

Responsibilities:

* fetch task
* execute task
* handle timeout
* handle retries
* handle cancellation

---

## Worker Pool

Controls a fixed number of workers.

Example:

```ts
workerCount = 4
```

Responsibilities:

* create workers
* start workers
* stop workers
* track active workers

This teaches bounded concurrency.

---

## Cancellation System

Use modern cancellation primitives.

Required:

```ts
AbortController
AbortSignal
```

Cancellation must support:

* queued tasks
* running tasks

Cancellation must be cooperative.

Example:

```ts
while (!signal.aborted) {
  await work()
}
```

---

## Timeout System

Tasks must terminate if execution exceeds limit.

Example:

```txt
timeout = 5000ms
```

---

## Retry System

Failed tasks retry automatically.

Example:

```txt
maxRetries = 3
```

Do NOT add exponential backoff yet.

Keep retries simple.

---

# Tasks / TODOs

---

## TODO 1 — Setup Runtime

* initialize Bun project
* enable strict TypeScript
* configure scripts
* create minimal logger utility

Done when:

* `bun run src/index.ts` works

---

## TODO 2 — Build FIFO Queue

Build:

* enqueue()
* dequeue()
* size()
* queue limit

Rules:

* FIFO ordering only
* reject overflow safely

Learn:

* buffering
* ordering
* overload protection

Done when:

* tasks preserve insertion order
* queue rejects overload correctly

---

## TODO 3 — Build Worker Loop

Build:

* fixed worker count
* infinite polling loop
* concurrent execution

Rules:

* workers continuously poll queue
* workers become idle after completion

Learn:

* bounded concurrency
* scheduling loops
* worker lifecycle

Done when:

* multiple tasks execute simultaneously

---

## TODO 4 — Build Task Lifecycle

Build task states:

* queued
* running
* completed
* failed
* cancelled
* timed_out

Rules:

* every transition must be explicit
* invalid transitions should fail loudly

Learn:

* orchestration state
* lifecycle consistency

Done when:

* task states remain predictable under stress

---

## TODO 5 — Build Async Task Execution

Simulate work:

```ts
await sleep(randomTime)
```

Later experiment with:

* CPU-heavy tasks
* I/O-heavy tasks
* hanging tasks

Learn:

* execution behavior
* async scheduling
* worker occupancy

Done when:

* workers execute async tasks reliably

---

## TODO 6 — Build Retry Logic

Build:

* retry counter
* retry scheduling
* permanent failure handling

Rules:

```txt
maxRetries = 3
```

Learn:

* transient failures
* retry amplification
* congestion

Done when:

* failed tasks retry automatically

---

## TODO 7 — Build Timeout Wrapper

Build:

* timeout enforcement
* forced timeout failure

Rules:

```txt
timeout = 5000ms
```

Learn:

* resource containment
* execution deadlines
* hung worker protection

Done when:

* hanging tasks terminate safely

---

## TODO 8 — Build Cooperative Cancellation

Build:

* AbortController integration
* queued task cancellation
* running task cancellation

Rules:

* cancellation must be cooperative
* do NOT fake cancellation

Learn:

* interruption semantics
* cancellation propagation
* race conditions

Done when:

* cancelled tasks stop predictably

---

## TODO 9 — Build Backpressure

Build:

* queue size limit
* overload rejection

Rules:

```txt
maxQueueSize = 100
```

Learn:

* overload control
* system stability
* memory protection

Done when:

* system safely rejects overload

---

## TODO 10 — Add Observability

Log everything.

Required logs:

```txt
TASK_ENQUEUED
TASK_STARTED
TASK_COMPLETED
TASK_FAILED
TASK_RETRY
TASK_CANCELLED
TASK_TIMED_OUT
QUEUE_FULL
WORKER_IDLE
WORKER_BUSY
```

Learn:

* observability
* execution tracing
* orchestration visibility

Done when:

* entire system behavior is visible through logs

---

## TODO 11 — Break the System Intentionally

Run stress tests.

### Infinite Task

```ts
while (true) {}
```

Learn:

* starvation
* timeout weaknesses

---

### Retry Storm

50 failing tasks.

Learn:

* retry amplification
* congestion

---

### Fast Producer

Producer faster than workers.

Learn:

* queue growth
* overload

---

### Slow Producer

Workers idle waiting for tasks.

Learn:

* throughput imbalance

---

### Cancellation Race

Cancel tasks:

* before execution
* during execution
* during retry

Learn:

* race conditions
* state consistency

Done when:

* system behavior becomes understandable under failure

---

# Explicitly NOT Allowed

Do NOT add:

* Redis
* HTTP APIs
* databases
* dashboards
* auth
* Docker
* metrics platforms
* clustering
* distributed coordination
* persistence
* WebSockets
* gRPC
* Kafka
* RabbitMQ

Those belong in future projects.

---

# Completion Criteria

Project is complete when:

* 100+ tasks execute reliably
* workers run concurrently
* retries behave correctly
* cancellations are predictable
* timeouts contain hanging tasks
* queue overload is handled safely
* task lifecycle transitions remain consistent

Stop after this.

Do not expand scope.

---

# What This Project Actually Teaches

| Feature       | Real Systems Concept      |
| ------------- | ------------------------- |
| Queue         | buffering                 |
| Worker Pool   | bounded concurrency       |
| Retry         | transient fault tolerance |
| Timeout       | failure containment       |
| Cancellation  | cooperative interruption  |
| Queue Limit   | overload protection       |
| Worker States | orchestration             |
| Task States   | lifecycle management      |

This is the foundation behind modern systems like:

* BullMQ
* Celery
* Temporal
* RabbitMQ
* Kafka consumers

---
