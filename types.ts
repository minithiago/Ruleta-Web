
export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface RouletteState {
  isSpinning: boolean;
  rotation: number;
  winner: Participant | null;
  aiMessage: string | null;
}
