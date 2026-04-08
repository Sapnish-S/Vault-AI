export interface Chat {
  id: string;
  title: string;
  timestamp: string;
  vault_name: string;
  sender_name?: string;
  receiver_name?: string;
  label?: string;
  time_frame?: string;
}

export type ChatSession = Chat;

export interface VaultFolder {
  id?: string;
  name: string;
  file_count: number;
  icon?: string;
}

export interface Document {
  id?: string;
  filename: string;
  type?: string;
  uploaded_at?: string;
}