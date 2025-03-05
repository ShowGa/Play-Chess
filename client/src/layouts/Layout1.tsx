import { Outlet } from "react-router-dom";

import Nav from "../components/Nav";

const Layout1 = () => {
  return (
    <>
      <Nav />
      <main className="bg-gray-800">
        <Outlet />
      </main>
    </>
  );
};

export default Layout1;
