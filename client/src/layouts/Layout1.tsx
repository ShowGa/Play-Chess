import { Link, Outlet } from "react-router-dom";

import Header1 from "../components/Header";

const Layout1 = () => {
  return (
    <>
      <Header1 />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout1;
