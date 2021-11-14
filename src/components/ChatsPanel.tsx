import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Modal,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Chats from "./Chats";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CHATS, GET_USER_CHATS } from "../utils/queries";
import { CREATE_CHAT, ADD_USER_TO_CHAT } from "../utils/mutations";
import { useAppSelector } from "../redux/reduxHooks";
import { auth } from "../firebase";
import { AnimateSharedLayout, motion, AnimatePresence } from "framer-motion";

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

const MotionBox = motion(Box);
const MotionDivider = motion(Divider);
const MotionStack = motion(Stack);

const ChatsPanel = () => {
  const [addingChat, setAddingChat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const user = useAppSelector((store) => store.profile);
  const [createChat] = useMutation(CREATE_CHAT);
  const [addUserToChat] = useMutation(ADD_USER_TO_CHAT);
  const [getAllChats, { data: allChats, loading: allChatsLoading }] =
    useLazyQuery(GET_ALL_CHATS);
  const { data: userChats, loading: userChatsLoading } = useQuery(
    GET_USER_CHATS,
    { variables: { email: user.email } }
  );

  const createServer = () => {
    if (newServerName === "") {
      alert("Server name is required.");
      return;
    }
    createChat({
      variables: {
        users: [{ email: user.email, username: user.username, _id: user.id }],
        name: newServerName,
      },
    });
    setModalOpen(false);
    setNewServerName("");
    setAddingChat(false);
  };

  return (
    <Stack
      justifyContent="space-between"
      height="100%"
      sx={{ bgcolor: "background.paper", overflowY: "auto" }}
    >
      <AnimateSharedLayout>
        <>
          <Stack spacing={2} sx={{ p: 4 }} height="100%">
            <MotionBox layout display="flex" justifyContent="space-between">
              <Typography variant="h6">Servers</Typography>
              <Button
                startIcon={addingChat ? <CloseIcon /> : <AddIcon />}
                onClick={() => {
                  getAllChats();
                  setAddingChat((prev) => !prev);
                }}
              >
                {addingChat ? "Cancel" : "New Server"}
              </Button>
            </MotionBox>
            <AnimatePresence>
              {addingChat && (
                <MotionStack
                  spacing={1}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: [1, 0.9, 0.9],
                    y: [0, 0, 50],
                  }}
                  transition={{ duration: 0.4 }}
                  layout
                >
                  <Button onClick={() => setModalOpen(true)} variant="outlined">
                    Create New Server
                  </Button>
                  <Divider>OR</Divider>
                  <Stack spacing={2}>
                    <Typography>
                      Select from already available servers.
                    </Typography>
                    <Stack height={200} spacing={1} sx={{ overflowY: "auto" }}>
                      {!allChatsLoading &&
                        allChats?.getAllChats &&
                        allChats.getAllChats.map(
                          (
                            chat: {
                              name: string;
                              _id: string;
                              users: [{ username: string }];
                            },
                            index: number
                          ) => (
                            <Stack
                              key={index}
                              alignItems="center"
                              direction="row"
                              spacing={2}
                            >
                              <Button
                                onClick={() => {
                                  if (
                                    !userChatsLoading &&
                                    userChats?.getUser?.user?.chats.includes(
                                      chat._id
                                    )
                                  ) {
                                    return alert("already in server.");
                                  }
                                  addUserToChat({
                                    variables: {
                                      chatId: chat._id,
                                      user: {
                                        username: user.username,
                                        email: user.email,
                                        _id: user.id,
                                      },
                                    },
                                  });
                                  setAddingChat(false);
                                }}
                              >
                                {chat.name}
                              </Button>
                              <Typography>
                                members: {chat.users.length}
                              </Typography>
                            </Stack>
                          )
                        )}
                      {allChatsLoading && (
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
                  </Stack>
                </MotionStack>
              )}
            </AnimatePresence>
            <MotionDivider layout flexItem />
            <Chats />
          </Stack>
          <Modal
            aria-labelledby="new chat"
            aria-describedby="modal-modal-description"
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setNewServerName("");
            }}
          >
            <Box sx={modalStyles}>
              <Stack spacing={2}>
                <Typography variant="h6" component="h2">
                  Create New Server
                </Typography>
                <TextField
                  autoComplete="server-name"
                  name="servername"
                  required
                  fullWidth
                  id="servername"
                  label="New servername"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                />
                <Button onClick={createServer}>Create Server</Button>
              </Stack>
            </Box>
          </Modal>
        </>
        <MotionBox layout>
          <Divider flexItem />
          <Stack sx={{ p: 4 }} spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar>{user.username[0]?.toUpperCase()}</Avatar>
                <Typography>{user.username}</Typography>
              </Stack>
            </Stack>
            <Typography>Email: {user.email}</Typography>
            <Button variant="outlined" onClick={() => auth.signOut()}>
              Sign Out
            </Button>
          </Stack>
        </MotionBox>
      </AnimateSharedLayout>
    </Stack>
  );
};

export default ChatsPanel;
