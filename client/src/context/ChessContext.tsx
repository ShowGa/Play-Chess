import { createContext, useContext, ReactNode } from "react";
import { useChessLogic } from "../hooks/useChessLogic";

const ChessContext = createContext<ReturnType<typeof useChessLogic> | null>(
  null
);

export const ChessProvider = ({ children }: { children: ReactNode }) => {
  const chessLogic = useChessLogic();

  return (
    <ChessContext.Provider value={chessLogic}>{children}</ChessContext.Provider>
  );
};

export const useChess = () => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("useChess must be used within a ChessProvider");
  return context;
};
