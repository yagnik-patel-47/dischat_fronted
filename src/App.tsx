import { FC } from "react";
import { Route, Switch } from "react-router";
import SignIn from "./screens/Signin";
import SignUp from "./screens/Signup";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import RootApp from "./screens/RootApp";
import { AnimatePresence } from "framer-motion";
import { CircularProgress, Container, CssBaseline } from "@mui/material";

const App: FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <Container
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CssBaseline />
        <CircularProgress />
      </Container>
    );
  if (!user)
    return (
      <Route
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter>
            <Switch location={location} key={location.pathname}>
              <Route path="/signup" component={SignUp} exact />
              <Route path={["/signin", "/"]} component={SignIn} />
            </Switch>
          </AnimatePresence>
        )}
      />
    );
  return <RootApp />;
};

export default App;
