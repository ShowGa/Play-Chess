import { Link, Outlet } from "react-router-dom";

import Header1 from "../components/Header";
import Nav from "../components/Nav";

const Layout1 = () => {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout1;
