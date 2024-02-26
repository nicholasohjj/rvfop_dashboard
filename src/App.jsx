import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate  } from 'react-router-dom';
import ErrorPage from "./routes/errorpage";
// original Windows95 font (optionally)
import { Login } from './routes/login';
import { Layout } from './layout';
import Scoreboard from "./routes/scoreboard";
import HomePage from "./routes/homepage";
import Group from "./routes/group";

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/scoreboard",
          element: <Scoreboard />,
        },
        {
          path: "/group",
          element: <Group />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App;