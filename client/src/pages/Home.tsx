import { Chessboard } from "react-chessboard";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="py-10 pl-[15rem] min-h-[100vh] h-1 bg-gray-800">
      <div className="flex gap-4 h-full w-full">
        <div className="flex-shrink flex-grow max-w-[42rem] h-full w-full">
          <div className="rounded-md overflow-hidden">
            <Chessboard />
          </div>
        </div>

        {/* here */}
        <div className="bg-gray-900 flex flex-col justify-center gap-4 p-6 rounded-md flex-grow flex-shrink max-w-[26rem]">
          <h1 className="text-white text-4xl font-bold text-center mb-4">
            Play Chess Online
          </h1>

          <div className="flex flex-col gap-4">
            <Link
              to="/playing-chess-friends"
              className="flex items-center bg-[#82bf56] hover:bg-[#75ad4d] text-white p-4 rounded-lg transition-colors"
            >
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold">Play With Friends</div>
                <div className="text-sm text-white/80">
                  Play with your friends by sharing the room id
                </div>
              </div>
            </Link>

            <Link
              to="/playing-chess-matching"
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-colors"
            >
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <span className="text-2xl">⚔️</span>
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold">
                  Play with match making
                </div>
                <div className="text-sm text-white/80">
                  Play with a random opponent at your level
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
