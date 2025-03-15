export type Player = { userId: string; username: string; color: string };

export type RoomInfo = {
  roomId: string;
  players: Player[];
  roomState: string;
};

export type ChessMove = {
  from: string;
  to: string;
  promotion?: string;
};

export type stateData = {
  gameState: string;
  // checkedPiece: string;
  gameover: boolean;
  winner: Player | null;
};

export type MessageData = {
  roomId: string;
  message: string;
  sender: string;
  isEmote?: boolean;
  // receiver: string;
};

export type RematchRequest = {
  sender: string;
  roomId: string;
};

export type RematchConfirmation = {
  sender: string;
  roomId: string;
  message: string;
};
