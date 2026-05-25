import { log } from "./logger";
import { Queue, type Task } from "./queue";

type WorkerState = "idle" | "busy" | "stopped";

export class Worker {
	private id: number;
	private queue: Queue;
	private state: WorkerState;
	private signal: AbortSignal;

	constructor(id: number, queue: Queue, signal: AbortSignal) {
		this.id = id
		this.queue = queue
		this.state = "idle"
		this.signal = signal
	}

	start(): void {
		const loop = async () => {
			while (!this.signal.aborted) {
				const task = this.queue.dequeue()
				if (task) {
					this.state = "busy"
					log("WORKER_BUSY", { workerId: this.id, taskId: task.id })
					await this.execute(task)
					this.state = "idle"
					log("WORKER_IDLE", { workerId: this.id })
				} else {
					await new Promise(r => setTimeout(r, 100))
				}
			}
			this.state = "stopped"
			log("WORKER_IDLE", { workerId: this.id, state: "stopped" })
		}
		loop()
	}
	
	stop(): void {
		this.state = "stopped"
	}
	getState(): WorkerState {
		return this.state
	}
	
	private async execute(task: Task): Promise<void> {
		log("TASK_STARTED", { id: task.id })
		task.state = "running"
		try {
			await new Promise(resolve => setTimeout(resolve, 1000))
			task.state = "completed"
			log("TASK_COMPLETED", { id: task.id })
		} catch {
			task.state = "failed"
			log("TASK_FAILED", { id: task.id })
		}
	}
}
