import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/home/Home";
import AvailableCars from "../pages/cars/AvailableCars";
import CarDetails from "../pages/cars/CarDetails";
import AddCar from "../pages/cars/AddCar";
import MyCars from "../pages/cars/MyCars";
import MyBookings from "../pages/bookings/MyBookings";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Error from "../pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "cars", element: <AvailableCars /> },
      { path: "cars/:id", element: <CarDetails /> },
      {
        path: "add-car",
        element: (
          <PrivateRoute>
            <AddCar />
          </PrivateRoute>
        ),
      },
      {
        path: "my-cars",
        element: (
          <PrivateRoute>
            <MyCars />
          </PrivateRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Error /> },
    ],
  },
]);
