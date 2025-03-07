export type RoomInfo = {
  name: string;
  players: { userId: string; username: string }[];
  roomState: string;
};
