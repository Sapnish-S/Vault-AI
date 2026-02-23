export interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

export interface VaultFolder {
  id: string;
  name: string;
  itemCount: number;
  icon?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
}