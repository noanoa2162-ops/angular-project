export interface Project {
  id: string;
  name: string;
  description: string;
  team_id: string;
  created_at?: string;
  status?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  teamId: string;
}
