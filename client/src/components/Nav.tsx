import { FaUserFriends } from "react-icons/fa";
import { RiSearchFill } from "react-icons/ri";
import { FaChess } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const navData = [
  {
    to: "playing-chess-friends",
    title: "Friends",
    icon: <FaUserFriends className="text-2xl text-orange-600" />,
  },
  {
    to: "playing-chess-matching",
    title: "Matching",
    icon: <RiSearchFill className="text-2xl text-rose-600" />,
  },
];

const Nav = () => {
  return (
    <div className="fixed border-r-2 border-gray-200 bg-gray-900 px-2 w-[11rem]">
      <div className="min-h-screen">
        <div className="flex justify-center items-center py-10">
          {/* <img alt="logo" className="w-16 h-16" /> */}
          <FaChess className="text-6xl text-yellow-700" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            {navData.map((item, index) => (
              <Link to={`/${item.to}`} key={index}>
                <div
                  className={`rounded-md mt-1 py-[0.5rem] px-[0.3rem] w-full hover:bg-gray-800 cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-white font-bold">{item.title}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div>
            <ul>{/* <SideBarLogoutButton /> */}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
