type WorkerState = "idle" | "busy" | "stopped";

class Worker {
	private id: number;
	private queue: Queue;
	private state: WorkerState;
	private signal: AbortSignal;
}
