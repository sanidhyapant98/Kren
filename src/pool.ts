import { Queue } from "./queue"
import { Worker } from "./worker"

class Pool {
	private workers: Worker[]
	private queue: Queue
	private controller: AbortController

	constructor(workerCount: number, queue: Queue) {
		this.queue = queue
		this.controller = new AbortController()
		this.workers = []

		for (let i = 0; i < workerCount; i++) {
			this.workers.push(new Worker(i, queue, this.controller.signal))
		}
	}

	start(): void {
		for (const worker of this.workers) {
			worker.start()
		}
	}

	stop(): void {
		this.controller.abort()
	}
}

export { Pool }
