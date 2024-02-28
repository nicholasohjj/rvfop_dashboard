import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate, Navigate  } from 'react-router-dom';
import ErrorPage from "./routes/errorpage";
// original Windows95 font (optionally)
import { Login } from './routes/login';
import { Layout } from './layout';
import Scoreboard from "./routes/scoreboard";
import HomePage from "./routes/homepage";
import Progress from "./routes/progress";

const App = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          //redirect to /scoreboard
          element: <Navigate to="/scoreboard" replace />,
          
        },
        {
          path: "/scoreboard",
          element: <Scoreboard />,
        },
        {
          path: "/progress",
          element: <Progress />,
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