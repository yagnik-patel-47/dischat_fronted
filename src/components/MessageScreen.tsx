import { useEffect, useState, useRef } from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Modal,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { GET_CHAT, FIND_USER_BY_USERNAME } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { Message as MessageType } from "../utils/interfaces";
import { useMutation, useSubscription, useLazyQuery } from "@apollo/client";
import { NEW_MESSAGE, ADD_USER_TO_CHAT } from "../utils/mutations";
import { useAppSelector, useAppDispatch } from "../redux/reduxHooks";
import Message from "./Message";
import { DELETE_MSG_SUB, NEW_MESSAGE_SUB } from "../utils/subscriptions";
import { useMediaQuery, Theme } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { setChatDrawer, setBothDrawer } from "../redux/drawers";
import AddIcon from "@mui/icons-material/Add";

const modalStyles = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

const MessageScreen = () => {
  const { id }: { id: string } = useParams();
  const messagesContainer = useRef<HTMLDivElement>(null);
  const { data, loading, refetch } = useQuery(GET_CHAT, {
    variables: { ChatId: id },
    onCompleted: (data) => {
      setMessages(data.getChat.messages);
      if (messagesContainer.current) {
        messagesContainer.current.scrollTop =
          messagesContainer.current.scrollHeight;
      }
    },
  });
  const { data: newMessage } = useSubscription(NEW_MESSAGE_SUB, {
    variables: { chatId: id },
  });
  const { data: deleteMsgSub } = useSubscription(DELETE_MSG_SUB, {
    variables: { chatId: id },
  });
  const user = useAppSelector((store) => store.profile);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [addNewModal, setAddNewModal] = useState(false);
  const [newUserUsername, setNewUserUsername] = useState("");
  const [sendNewMessage] = useMutation(NEW_MESSAGE);
  const [addToChat] = useMutation(ADD_USER_TO_CHAT);
  const smallScreenDevices = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );
  const [findUser, { data: userFound, loading: newUserLoading }] = useLazyQuery(
    FIND_USER_BY_USERNAME
  );
  const dispatch = useAppDispatch();

  const sendMessage = () => {
    if (messageText === "") {
      return alert("pls write something");
    }
    sendNewMessage({
      variables: {
        chatId: id,
        sender: user.id,
        timestamp: Date.now().toString(),
        message: messageText,
      },
    });
    setMessageText("");
  };

  useEffect(() => {
    if (newMessage !== undefined) {
      setMessages((prev) => [...prev, newMessage.newMessage]);
      setTimeout(() => {
        if (messagesContainer.current) {
          messagesContainer.current.scrollTop =
            messagesContainer.current.scrollHeight;
        }
      }, 300);
    }
  }, [newMessage]);

  useEffect(() => {
    if (deleteMsgSub !== undefined) {
      const remainingMessages = messages.filter(
        (_message, index) => index !== deleteMsgSub.deleteMessage.index
      );
      setMessages(remainingMessages);
    }
  }, [deleteMsgSub]);

  useEffect(() => {
    refetch({ ChatId: id });
  }, [id]);

  useEffect(() => {
    dispatch(setChatDrawer(false));
  }, []);

  useEffect(() => {
    const userIsAlreadyIn = data?.getChat?.users?.find(
      (user: { username: string }) =>
        user.username === userFound?.findUserByUsername?.user?.username
    );
    if (userIsAlreadyIn) return alert("User is already in server.");
    if (userFound?.findUserByUsername?.user && !userIsAlreadyIn) {
      addToChat({
        variables: {
          chatId: id,
          user: {
            username: userFound.findUserByUsername.user.username,
            email: userFound.findUserByUsername.user.email,
            _id: userFound.findUserByUsername.user._id,
          },
        },
      });
    }
  }, [userFound?.findUserByUsername?.user]);

  const checkUser = async () => {
    findUser({ variables: { username: newUserUsername } });
  };

  return (
    <>
      {loading && !data?.getChat ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              {smallScreenDevices && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => dispatch(setChatDrawer(true))}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {data.getChat.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  onClick={() => setAddNewModal(true)}
                  startIcon={<AddIcon />}
                >
                  User
                </Button>
                {smallScreenDevices && (
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="profile"
                    onClick={() =>
                      dispatch(
                        setBothDrawer({ chat: false, chatDetails: true })
                      )
                    }
                  >
                    <AccountCircleIcon />
                  </IconButton>
                )}
              </Stack>
            </Toolbar>
          </AppBar>
          <Box
            flexGrow={1}
            height="100%"
            sx={{ overflowY: "auto", scrollBehavior: "smooth" }}
            ref={messagesContainer}
          >
            {messages.length === 0 ? (
              <Box
                height="100%"
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                <Typography>No messages here!</Typography>
              </Box>
            ) : (
              <Stack spacing={2} py={2} px={4}>
                {messages.map(({ message, timestamp, sender }, index) => (
                  <Message
                    timestamp={timestamp}
                    message={message}
                    sender={sender}
                    key={index}
                    index={index}
                    chatId={id}
                  />
                ))}
              </Stack>
            )}
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{ px: 3, py: 2 }}
          >
            <TextField
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              variant="filled"
              label="chat text here..."
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <IconButton size="large" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      )}
      <Modal
        aria-labelledby="new chat"
        aria-describedby="modal-modal-description"
        open={addNewModal}
        onClose={() => {
          setNewUserUsername("");
          setAddNewModal(false);
        }}
      >
        {!newUserLoading ? (
          <Box sx={modalStyles}>
            <Stack spacing={2}>
              <Typography variant="h6">Add new user.</Typography>
              <TextField
                autoComplete="username"
                name="username"
                required
                fullWidth
                id="username"
                label="username of new person."
                value={newUserUsername}
                onChange={(e) => setNewUserUsername(e.target.value)}
                error={Boolean(userFound?.findUserByUsername?.error)}
                helperText={
                  Boolean(userFound?.findUserByUsername?.error) &&
                  userFound.findUserByUsername.error.message
                }
              />
              {userFound?.findUserByUsername &&
                userFound.findUserByUsername.user && (
                  <Typography sx={{ mt: 2 }}>
                    User added successfully
                  </Typography>
                )}
              <Stack direction="row">
                <Button onClick={checkUser}>Add</Button>
                <Button
                  onClick={() => {
                    setNewUserUsername("");
                    setAddNewModal(false);
                  }}
                >
                  Close
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{ ...modalStyles, display: "flex", justifyContent: "center" }}
          >
            <CircularProgress />
          </Box>
        )}
      </Modal>
    </>
  );
};

export default MessageScreen;
