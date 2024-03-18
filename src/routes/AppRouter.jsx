import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import userAuth from "../hooks/userAuth";
import RegisterForm from "../layout/RegisterForm";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import HeaderAdmin from "../layout/HeaderAdmin";
import Data from "../layout/Data";
import Tables from "../layout/Tables";
import AdminHome from "../layout/AdminHome";
import DataUser from "../layout/DataUser";
import DataType from "../layout/DataType";
import DataTable from "../layout/DataTable";
import DataBooking from "../layout/DataBooking";
import Contact from "../layout/Contact";
import CreateType from "../layout/CreateType";
import CreateTable from "../layout/CreateTable";
import BookingTable from "../layout/BookingTable";
import UpdateProfile from "../layout/updeteProfile";
import Profile from "../layout/Profile";
import TableOrdinary from "../layout/TableOrdinary ";
import TableVIP from "../layout/TableVIP";
import Succeed from "../layout/Succeed";
import DataBookingUser from "../layout/DataBookingUser";

const guesRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/Tables", element: <Tables /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
      { path: "/BookingTable/*", element: <BookingTable /> },
      { path: "/UserHome", element: <UserHome /> },
      { path: "/Contact", element: <Contact /> },
      { path: "/TableOrdinary", element: <TableOrdinary /> },
      { path: "/TableVIP", element: <TableVIP /> },
    ],
  },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <hr />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/Tables", element: <Tables /> },
      { path: "/UserHome", element: <UserHome /> },
      { path: "/Contact", element: <Contact /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/updateProfile", element: <UpdateProfile /> },
      // { path: "/BookingTable", element: <BookingTable/> },
      { path: "/BookingTable/*", element: <BookingTable /> },
      { path: "/Succeed", element: <Succeed /> },
      { path: "/DataBookingUser", element: <DataBookingUser /> },
      { path: "/TableOrdinary", element: <TableOrdinary /> },
      { path: "/TableVIP", element: <TableVIP /> },
    ],
  },
]);

const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <HeaderAdmin />
        <hr />
        <Outlet />
      </>
    ),

    children: [
      { index: true, element: <AdminHome /> },
      { path: "/Data", element: <Data /> },
      { path: "/AdminHome", element: <AdminHome /> },
      { path: "/DataUser", element: <DataUser /> },
      { path: "/DataType", element: <DataType /> },
      { path: "/DataTable", element: <DataTable /> },
      { path: "/DataBooking", element: <DataBooking /> },
      { path: "/CreateType", element: <CreateType /> },
      { path: "/CreateTable", element: <CreateTable /> },
    ],
  },
]);

export default function AppRouter() {
  const { user } = userAuth();
  const finalRouter = user?.user_id
    ? user.role === "ADMIN"
      ? adminRouter
      : userRouter
    : guesRouter;
  return <RouterProvider router={finalRouter} />;
}
