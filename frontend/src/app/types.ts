export interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

export interface VaultFolder {
  id: string;       // used as vault_name on the backend
  name: string;
  itemCount: number;
  icon?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
}

export interface VaultFile {
  filename: string;
  uploaded_at: string;
}
