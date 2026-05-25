import { log } from "./logger"
import { Queue } from "./queue"
import { Pool } from "./pool"

const queue = new Queue(100)
const pool = new Pool(4, queue)

const taskBase = {
	retries: 0,
	maxRetries: 3,
	timeoutMs: 5000,
	state: "queued" as const,
	createdAt: Date.now(),
}

for (let i = 0; i < 10; i++) {
	const ok = queue.enqueue({
		id: String(i + 1),
		payload: `task-${i + 1}`,
		...taskBase,
		createdAt: Date.now(),
	})

	if (ok) {
		log("TASK_ENQUEUED", { id: String(i + 1), payload: `task-${i + 1}` })
	} else {
		log("QUEUE_FULL", { id: String(i + 1) })
	}
}

pool.start()

setTimeout(() => {
	pool.stop()
	log("WORKER_IDLE", { state: "pool stopped" })
	process.exit(0)
}, 10000)
