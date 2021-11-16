import { initProfileData } from "../redux/profile";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { GET_USER } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import {
  CssBaseline,
  Box,
  Drawer,
  Typography,
  Button,
  useMediaQuery,
  Theme,
} from "@mui/material";
import ChatsPanel from "../components/ChatsPanel";
import ChatDetailsPanel from "../components/ChatDetailsPanel";
import { Switch, Route } from "react-router-dom";
import MessageScreen from "../components/MessageScreen";
import { setBothDrawer, setChatDrawer } from "../redux/drawers";
import RedirectPage from "../components/RedirectPage";

const RootApp = () => {
  const dispatch = useAppDispatch();
  const [user] = useAuthState(auth);
  const { data } = useQuery(GET_USER, { variables: { email: user.email } });
  const drawers = useAppSelector((store) => store.drawers);
  const smallScreenDevices = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  useEffect(() => {
    if (data && !data.getUser.error) {
      dispatch(initProfileData(data.getUser.user));
    }
  }, [data]);

  return (
    <Box component="main" height="100%">
      <CssBaseline />
      <Box sx={{ display: "flex" }} height="100%">
        <Drawer
          variant="temporary"
          open={drawers.chat}
          onClose={() => dispatch(setChatDrawer(false))}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: "100%" },
          }}
        >
          <ChatsPanel />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            width: "30%",
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              position: "relative",
            },
          }}
          open
        >
          <ChatsPanel />
        </Drawer>
        <Switch>
          <Route path="/chat/:id" exact>
            <MessageScreen />
            <Drawer
              variant="temporary"
              anchor="right"
              open={drawers.chatDetails}
              onClose={() =>
                dispatch(setBothDrawer({ chat: false, chatDetails: false }))
              }
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", lg: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: "100%",
                },
              }}
            >
              <ChatDetailsPanel />
            </Drawer>
            <Drawer
              variant="permanent"
              anchor="right"
              sx={{
                display: { xs: "none", lg: "block", width: "25%" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  position: "relative",
                },
              }}
              open
            >
              <ChatDetailsPanel />
            </Drawer>
          </Route>
          <Route path={["/signin", "/signup"]} component={RedirectPage} exact />
          <Route path={["/", "/chat"]} exact>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                alignItems: "center",
                width: "100%",
              }}
            >
              {smallScreenDevices ? (
                <Button
                  color="inherit"
                  onClick={() => dispatch(setChatDrawer(true))}
                >
                  Click here to open chats.
                </Button>
              ) : (
                <Typography color="darkgrey" variant="h6">
                  Click any chat to start.
                </Typography>
              )}
            </Box>
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default RootApp;
