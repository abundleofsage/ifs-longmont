export enum GamePhase {
  BOOT_SEQUENCE = 'BOOT_SEQUENCE',
  DRIVING_LOOP = 'DRIVING_LOOP',
  NEGOTIATION = 'NEGOTIATION',
  NIGHT_PHASE = 'NIGHT_PHASE',
  SUMMARY = 'SUMMARY'
}

export enum ProtectorType {
  GABLE = 'GABLE', // Math, Logic, Time Dilation
  CAMOUFLAGE = 'CAMOUFLAGE', // Blending, Texture
  GATEKEEPER = 'GATEKEEPER', // Border Control
  AVENGER = 'AVENGER' // Bureaucracy (Locked)
}

export interface ResourceState {
  coherence: number; // 0-100 (Health)
  coldLoad: number; // 0-100 (Environmental Pressure)
  sleepDebt: number; // 0-100 (Fatigue)
  paperReality: number; // 0-100 (Legitimacy)
  fleshReality: number; // 0-100 (Body Integrity)
}

export interface DialogueOption {
  id: string;
  text: string;
  loadImpact: Partial<ResourceState>;
  protector?: ProtectorType;
  riskDelta?: number; // For Gable
  blendBonus?: number; // For Camouflage
  nextNodeId: string;
  requiredFlag?: string;
  description?: string; // Internal system note
}

export interface NarrativeNode {
  id: string;
  text: string;
  speaker: string;
  exileTrigger?: string; // Text for Exile overlay
  options: DialogueOption[];
  isEndNode?: boolean;
}

export interface GameState {
  phase: GamePhase;
  resources: ResourceState;
  activeProtectors: ProtectorType[];
  currentNodeId: string;
  flags: Record<string, boolean>;
  log: string[];
  systemWarnings: string[];
}
