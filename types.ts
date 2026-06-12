export interface StoryRequest {
  concept: string;
  style: string;
  sceneCount: number;
  language: string;
  aspectRatio: string;
  noMusic: boolean;
}

export interface StoryAsset {
  name: string;
  type: string; // e.g., Character, Location, Vehicle, Prop
  description: string;
  imagePrompt: string;
}

export interface DialogueLine {
  character: string;
  text: string;
}

export interface Scene {
  sceneNumber: number;
  location: string;
  actionDescription: string;
  lighting: string;
  cameraAngle: string;
  imagePrompt: string;
  animationPrompt: string;
  dialogue: DialogueLine[];
}

export interface StoryBoardResponse {
  title: string;
  summary: string;
  assets: StoryAsset[];
  scenes: Scene[];
}

export interface CyberVulnerability {
  title: string;
  risk: string; // e.g., منخفض, متوسط, مرتفع, حرِج
  description: string;
  fix: string;
}

export interface SecurityCommand {
  tool: string; // e.g., Nmap, Wireshark, Burp Suite
  command: string;
  description: string;
  promptText: string; // Prompt for diagnostic tools or AI security analysis
}

export interface CyberAdviceResponse {
  title: string;
  riskLevel: string; // منخفض | متوسط | مرتفع | حرِج
  summary: string;
  vulnerabilities: CyberVulnerability[];
  commands: SecurityCommand[];
  recommendations: string[];
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}