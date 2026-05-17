import { Outlet } from "react-router";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const MainLayout = () => {
  return (
    <>
    <Navbar></Navbar>
    <Outlet />
    <Footer></Footer>
    </>
  );
};

export default MainLayout;
