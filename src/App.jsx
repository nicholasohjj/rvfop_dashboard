import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ErrorPage from "./routes/errorpage";
import { Login } from "./routes/login";
import { Layout } from "./layout";
import Scoreboard from "./routes/normal/scoreboard";
import Loading from "./routes/loading";
import Progress from "./routes/normal/progress";
import { supabaseClient } from "./supabase/supabaseClient";
import { Update } from "./routes/update";
import { Reset } from "./routes/reset";
import AddActivity from "./routes/gm/addActivity";
import AddDeduction from "./routes/deductor/addDeduction";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Deductions from "./routes/deductor/deductions";
import { Signup } from "./routes/signup";
import Games from "./routes/gm/games";
import Messenger from "./routes/normal/messenger";
import Matcher from "./routes/normal/matcher";
import { Profile } from "./routes/profile";
const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      setSession(session);
      // Set loading to false after the session check
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Ideally, handle loading state here as well if necessary
      }
    );

    // Cleanup listener on component unmount
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: loading ? (
        <Loading />
      ) : session ? (
        <Layout />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Navigate to="/scoreboard" replace />,
        },
        {
          path: "/match",
          element: <Matcher />,
        },
        {
          path: "/scoreboard",
          element: <Scoreboard />,
        },
        {
          path: "/message",
          element: <Messenger />,
        },
        {
          path: "/games",
          element: <Games />,
        },
        {
          path: "/progress",
          element: <Progress />,
        },
        {
          path: "/deductions",
          element: <Deductions />,
        },
        {
          path: "/addactivity",
          element: <AddActivity />,
        },
        {
          path: "/adddeduction",
          element: <AddDeduction />,
        },
      ],
    },
    {
      path: "/login",
      element: loading ? (
        <Loading />
      ) : !session ? (
        <Login />
      ) : (
        <Navigate to="/" replace />
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: loading ? (
        <Loading />
      ) : !session ? (
        <Signup />
      ) : (
        <Navigate to="/" replace />
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/update",
      element: loading ? (
        <Loading />
      ) : session ? (
        <Update />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/profile",
      element: loading ? (
        <Loading />
      ) : session ? (
        <Profile />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/reset",
      element: loading ? (
        <Loading />
      ) : session ? (
        <Reset />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/loading",
      element: <Loading />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
