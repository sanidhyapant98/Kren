export type LogEvent =
	| "TASK_ENQUEUED"
	| "TASK_STARTED"
	| "TASK_COMPLETED"
	| "TASK_FAILED"
	| "TASK_RETRY"
	| "TASK_CANCELLED"
	| "TASK_TIMED_OUT"
	| "QUEUE_FULL"
	| "WORKER_IDLE"
	| "WORKER_BUSY";

export function log(event: LogEvent, meta?: Record<string, unknown>): void {
	console.log(`[${new Date().toISOString()}]`, event, meta ?? "");
}
