export interface Team {
  id: string;
  name: string;
  description?: string;
  members_count: number;
  color?: string;
  created_at?: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface AddMemberRequest {
  userId: string;
}
