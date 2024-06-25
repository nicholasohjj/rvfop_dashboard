import { useState, useEffect, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Video from "./routes/authenticated/video";
import { userContext, groupsContext, sessionContext, housesContext } from "./context/context";
import ErrorPage from "./routes/errorpage";
import { Login } from "./routes/login";
import { Layout } from "./layout";
import Scoreboard from "./routes/scoreboard";
import Loading from "./routes/loading";
import Progress from "./routes/authenticated/normal/progress";
import { supabaseClient } from "./supabase/supabaseClient";
import { Update } from "./routes/authenticated/update";
import { Reset } from "./routes/authenticated/reset";
import AddActivity from "./routes/authenticated/gm/addActivity";
import AddDeduction from "./routes/authenticated/deductor/addDeduction";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Deductions from "./routes/authenticated/deductor/deductions";
import Games from "./routes/authenticated/gm/games";
import Messenger from "./routes/authenticated/messenger";
import Matcher from "./routes/authenticated/matcher";
import { Profile } from "./routes/authenticated/profile";
import { Signup } from "./routes/signup";
import { SignupByInvite } from "./routes/authenticated/signUpByInvite";
import { ResetForm } from "./routes/resetForm";
import About from "./routes/about";
const App = () => {
  const [session, setSession] = useState(null);
  const [groups, setGroups] = useState([]);
  const [houses, setHouses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      setSession(session);
    };

    checkSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup listener on component unmount
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Scoreboard />,
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
          path: "/video",
          element: <Video />,
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
      path: "/about",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <About />,
        },
      ],
    },
    {
      path: "/login",
      element: !session ? <Login /> : <Navigate to="/" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: !session ? <Signup /> : <Navigate to="/" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/resetform",
      element: !session ? <ResetForm /> : <Navigate to="/" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/invite",
      element: session ? <SignupByInvite /> : <Navigate to="/" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/error",
      element: <ErrorPage />,
    },
    {
      path: "/update",
      element: session ? <Update /> : <Navigate to="/login" replace />,
    },
    {
      path: "/profile",
      element: session ? <Profile /> : <Navigate to="/login" replace />,
    },
    {
      path: "/reset",
      element: session ? <Reset /> : <Navigate to="/login" replace />,
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
      <Suspense fallback={<Loading />}>
      <housesContext.Provider value={{ houses, setHouses }}>
      <sessionContext.Provider value={{ session, setSession }}>
        <groupsContext.Provider value={{ groups, setGroups }}>
          <userContext.Provider value={{ user, setUser }}>
            <RouterProvider router={router} />
            <Analytics />
            <SpeedInsights />
          </userContext.Provider>
        </groupsContext.Provider>
      </sessionContext.Provider>
      </housesContext.Provider>
      </Suspense>
    </>
  );
};

export default App;
