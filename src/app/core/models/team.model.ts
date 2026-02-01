export interface Team {
  id: string;
  name: string;
  members_count: number;
  created_at?: string;
}

export interface CreateTeamRequest {
  name: string;
}

export interface AddMemberRequest {
  userId: string;
}
