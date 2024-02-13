import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import userAuth from "../hooks/userAuth";
import RegisterForm from "../layout/RegisterForm";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import Product from "../layout/Product";
import HeaderAdmin from "../layout/HeaderAdmin";
import DataUser from "../layout/DataUser";

const guesRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <hr />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/Product", element: <Product /> },
      { path: "/UserHome", element: <UserHome /> },
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
      { path: "/Product", element: <Product /> },
      { path: "/UserHome", element: <UserHome /> },
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
      { index: true, element: <UserHome /> },
      { path: "/DataUser", element: <DataUser /> },
    ],
  },
]);

export default function AppRouter() {
  const { user } = userAuth();
  const finalRouter = user?.user_id ? user.role === "ADMIN" ? adminRouter : userRouter : guesRouter;
  return <RouterProvider router={finalRouter} />;
}
