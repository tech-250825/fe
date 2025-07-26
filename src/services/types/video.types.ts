export interface TaskItem {
  type: string;
  task: {
    id: number;
    prompt: string;
    lora: string;
    status: string;
    runpodId: string | null;
    createdAt: string;
  };
  image: {
    id: number;
    url: string;
    index: number;
    createdAt: string;
  } | null;
}

export interface BackendResponse<T> {
  timestamp: string;
  statusCode: number;
  message: string;
  data: T;
}

export interface TaskListData {
  content: TaskItem[];
  nextPageCursor: string | null;
  previousPageCursor: string | null;
}
