import { ChatSession, VaultFolder, Document } from './types';

export const RECENT_CHATS: ChatSession[] = [
  { id: '1', title: 'Customer Data Analysis', timestamp: '2h ago' },
  { id: '2', title: 'Nokia AI Analysis Q3', timestamp: '5h ago' },
  { id: '3', title: 'HR Team Meeting Notes', timestamp: '1d ago' },
  { id: '4', title: 'Project Alpha Roadmap', timestamp: '2d ago' },
  { id: '5', title: 'Security Protocol V2', timestamp: '3d ago' },
];

export const VAULT_FOLDERS: VaultFolder[] = [
  { id: 'f1', name: 'Finance Reports', itemCount: 12 },
  { id: 'f2', name: 'User Research', itemCount: 45 },
  { id: 'f3', name: 'Legal Docs', itemCount: 8 },
  { id: 'f4', name: 'Brand Assets', itemCount: 120 },
  { id: 'f5', name: 'Voice Memos', itemCount: 3 },
  { id: 'f6', name: 'Code Snippets', itemCount: 24 },
];

export const FOLDER_DOCUMENTS: Record<string, Document[]> = {
  'f1': [
    { id: 'd1', name: 'Q4_Financial_Report.pdf', type: 'pdf' },
    { id: 'd2', name: 'Budget_2024.xlsx', type: 'xlsx' },
    { id: 'd3', name: 'Tax_Documents.pdf', type: 'pdf' },
  ],
  'f2': [
    { id: 'd4', name: 'User_Interview_Notes.pdf', type: 'pdf' },
    { id: 'd5', name: 'Survey_Results.xlsx', type: 'xlsx' },
    { id: 'd6', name: 'Persona_Profiles.pdf', type: 'pdf' },
  ],
  'f3': [
    { id: 'd7', name: 'Contract_Template.pdf', type: 'pdf' },
    { id: 'd8', name: 'NDA_Agreement.pdf', type: 'pdf' },
    { id: 'd9', name: 'Terms_of_Service.pdf', type: 'pdf' },
  ],
  'f4': [
    { id: 'd10', name: 'Logo_Files.zip', type: 'zip' },
    { id: 'd11', name: 'Brand_Guidelines.pdf', type: 'pdf' },
    { id: 'd12', name: 'Color_Palette.pdf', type: 'pdf' },
  ],
  'f5': [
    { id: 'd13', name: 'Meeting_Recording_01.mp3', type: 'mp3' },
    { id: 'd14', name: 'Voice_Note_Ideas.mp3', type: 'mp3' },
    { id: 'd15', name: 'Interview_Audio.mp3', type: 'mp3' },
  ],
  'f6': [
    { id: 'd16', name: 'API_Integration.js', type: 'js' },
    { id: 'd17', name: 'Database_Schema.sql', type: 'sql' },
    { id: 'd18', name: 'Utility_Functions.ts', type: 'ts' },
  ],
};