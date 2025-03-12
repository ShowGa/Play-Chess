import { createContext, useContext, ReactNode, useState } from "react";
import { useChessLogic } from "../hooks/useChessLogic";

type ChessContextType = ReturnType<typeof useChessLogic> & {
  showGameOverModal: boolean;
  setShowGameOverModal: (show: boolean) => void;
};

const ChessContext = createContext<ChessContextType | null>(null);

export const ChessProvider = ({ children }: { children: ReactNode }) => {
  const chessLogic = useChessLogic();
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(true);

  const contextValue: ChessContextType = {
    ...chessLogic,
    showGameOverModal,
    setShowGameOverModal,
  };

  return (
    <ChessContext.Provider value={contextValue}>
      {children}
    </ChessContext.Provider>
  );
};

export const useChess = () => {
  const context = useContext(ChessContext);
  if (!context) throw new Error("useChess must be used within a ChessProvider");
  return context;
};
