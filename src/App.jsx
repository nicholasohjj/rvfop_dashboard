import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate  } from 'react-router-dom';
import ErrorPage from "./routes/errorpage";
import { Login } from './routes/login';
import { Layout } from './layout';
import Scoreboard from "./routes/scoreboard";
import HomePage from "./routes/homepage";
import Progress from "./routes/progress";
import { supabaseClient } from './supabase/supabaseClient';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        setSession(session);
    };

    checkSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });

}, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: session ? <Layout /> : <Navigate to="/login" replace />,
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