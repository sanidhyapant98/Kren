type Task = {
	id: string;
	payload: unknown;
	retries: number;
	maxRetries: number;
	timeoutMs: number;
	state: TaskState;
	createdAt: number;
};

type TaskState =
	| "queued"
	| "running"
	| "completed"
	| "failed"
	| "cancelled"
	| "timed_out";

class Queue {
	private tasks: Task[] = [];
	private maxSize: number;

	constructor(maxSize = 100) {
        this.maxSize = maxSize
    };
	enqueue(task: Task): boolean {
        if(this.isFull()) return false
        this.tasks.push(task)
        return true
    };
	dequeue(): Task | undefined {
        return this.tasks.shift()
    };
	size(): number {
        return this.tasks.length
    };
	isFull(): boolean {
         return this.tasks.length >= this.maxSize
    };
}
