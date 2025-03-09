export type Player = { userId: string; username: string; color: string };

export type RoomInfo = {
  roomId: string;
  players: Player[];
  roomState: string;
};
