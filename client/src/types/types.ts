export type Player = { userId: string; username: string; color: string };

export type RoomInfo = {
  name: string;
  players: Player[];
  roomState: string;
};
