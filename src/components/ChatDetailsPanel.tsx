import {
  Typography,
  Stack,
  Avatar,
  useMediaQuery,
  Theme,
  Divider,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch } from "../redux/reduxHooks";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { setBothDrawer } from "../redux/drawers";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_CHAT_USERS = gql`
  query ($ChatId: ID!) {
    getChat(id: $ChatId) {
      name
      _id
      users {
        username
      }
    }
  }
`;

const ChatDetailsPanel = () => {
  const { id }: { id: string } = useParams();
  const { data, loading } = useQuery(GET_CHAT_USERS, {
    variables: { ChatId: id },
  });
  const dispatch = useAppDispatch();
  const smallScreenDevices = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );
  return (
    <Stack
      height="100%"
      sx={{ py: 4, bgcolor: "background.paper", px: 4, overflowY: "auto" }}
      spacing={3}
    >
      {!loading && data.getChat ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">{data.getChat.name}</Typography>
            {smallScreenDevices && (
              <IconButton
                onClick={() =>
                  dispatch(setBothDrawer({ chatDetails: false, chat: false }))
                }
              >
                <CloseRoundedIcon />
              </IconButton>
            )}
          </Stack>
          <Divider flexItem />
          <Stack spacing={2}>
            <Typography>Members</Typography>
            <Stack spacing={2}>
              {data.getChat.users.map(
                (user: { username: string }, index: number) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                  >
                    <Avatar>{user.username[0].toUpperCase()}</Avatar>
                    <Typography>{user.username}</Typography>
                  </Stack>
                )
              )}
            </Stack>
          </Stack>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Stack>
  );
};

export default ChatDetailsPanel;
