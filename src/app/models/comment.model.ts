export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

export interface CreateCommentRequest {
  content: string;
  taskId: string;
}
