import {
  Stack,
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import { GET_USER_CHATS } from "../utils/queries";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import { GET_ONLY_CHAT_NAME } from "../utils/queries";
import { useHistory } from "react-router-dom";
import { setChatDrawer } from "../redux/drawers";
import { NEW_CHAT_SUB } from "../utils/subscriptions";
import { useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { LEAVE_CHAT } from "../utils/mutations";
import { motion } from "framer-motion";

const MotionStack = motion(Stack);

const Chats = () => {
  const user = useAppSelector((store) => store.profile);
  const { data, loading, refetch } = useQuery(GET_USER_CHATS, {
    variables: { email: user.email },
  });
  const { data: newChat } = useSubscription(NEW_CHAT_SUB, {
    variables: { userId: user.id },
  });

  useEffect(() => {
    if (newChat !== undefined && newChat.newChat.chatId) {
      refetch();
    }
  }, [newChat]);

  return (
    <MotionStack layout height="100%" sx={{ overflowY: "auto" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {data.getUser.user && data.getUser.user.chats.length === 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography>No one in chats right now!</Typography>
            </Box>
          )}
          {data?.getUser?.user &&
            data.getUser.user.chats.length > 0 &&
            data.getUser.user.chats.map((id: string) => (
              <ChatLink id={id} key={id} />
            ))}
        </>
      )}
    </MotionStack>
  );
};

export default Chats;

const ChatLink = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.profile);
  const router = useHistory();
  const { data, loading } = useQuery(GET_ONLY_CHAT_NAME, {
    variables: { ChatId: id },
  });
  const [leaveChat] = useMutation(LEAVE_CHAT);
  return (
    <>
      {!loading && data && data.getChat && (
        <Stack direction="row" alignItems="center" spacing={3}>
          <Button
            color="secondary"
            onClick={() => {
              router.push(`/chat/${id}`);
              dispatch(setChatDrawer(false));
            }}
            sx={{ py: 3, justifyContent: "start" }}
            fullWidth
          >
            {data.getChat.name}
          </Button>
          <IconButton
            onClick={() =>
              leaveChat({ variables: { chatId: id, userId: user.id } })
            }
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      )}
    </>
  );
};
