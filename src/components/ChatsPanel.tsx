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
import { useFormik } from "formik";
import * as yup from "yup";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  FIND_USER_BY_USERNAME,
  GET_ALL_CHATS,
  GET_USER_CHATS,
} from "../utils/queries";
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

const ChatsPanel = () => {
  const [addingChat, setAddingChat] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const user = useAppSelector((store) => store.profile);
  const validationSchema = yup.object({
    username: yup.string().required("Username is required."),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema,
    onSubmit: onSubmitFormik,
  });
  const [createChat] = useMutation(CREATE_CHAT);
  const [addUserToChat] = useMutation(ADD_USER_TO_CHAT);
  const [findUser, { data, loading }] = useLazyQuery(FIND_USER_BY_USERNAME, {
    onCompleted: () => setModalOpen(true),
  });
  const [getAllChats, { data: allChats, loading: allChatsLoading }] =
    useLazyQuery(GET_ALL_CHATS);
  const { data: userChats, loading: userChatsLoading } = useQuery(
    GET_USER_CHATS,
    { variables: { email: user.email } }
  );

  function onSubmitFormik(values: { username: string }) {
    if (values.username.includes(" ")) {
      formik.setFieldError("username", "Username should not contain space.");
      return;
    }
    if (formik.values.username === user.username) {
      alert("LOL. its your username 😂.");
      return;
    }
    findUser({
      variables: {
        username: values.username,
      },
    });
  }

  const createServer = () => {
    if (newServerName === "") {
      alert("Server name is required.");
      return;
    }
    createChat({
      variables: {
        users: [
          { email: user.email, username: user.username, _id: user.id },
          {
            email: data.findUserByUsername.user.email,
            username: data.findUserByUsername.user.username,
            _id: data.findUserByUsername.user._id,
          },
        ],
        name: newServerName,
      },
    });
    setModalOpen(false);
    setNewServerName("");
    setAddingChat(false);
    formik.resetForm();
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
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Servers</Typography>
              <Button
                startIcon={addingChat ? <CloseIcon /> : <AddIcon />}
                onClick={() => {
                  getAllChats();
                  setAddingChat((prev) => !prev);
                  if (!addingChat) {
                    formik.resetForm();
                  }
                }}
              >
                {addingChat ? "Cancel" : "Create New Server"}
              </Button>
            </Box>
            <AnimatePresence>
              {addingChat && (
                <motion.form
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: [1, 0.9, 0.9],
                    y: [0, 0, 50],
                  }}
                  transition={{ duration: 0.4 }}
                  layout
                  onSubmit={formik.handleSubmit}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={4}>
                      <TextField
                        autoComplete="given-name"
                        name="username"
                        required
                        variant="filled"
                        fullWidth
                        id="username"
                        label="Username to add"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.username &&
                          Boolean(formik.errors.username)
                        }
                        helperText={
                          formik.touched.username && formik.errors.username
                        }
                      />
                      <Button type="submit" variant="outlined">
                        Add
                      </Button>
                    </Stack>
                    <Divider>OR</Divider>
                    <Stack spacing={2}>
                      <Typography>
                        Select from already available servers.
                      </Typography>
                      <Stack
                        height={200}
                        spacing={1}
                        sx={{ overflowY: "auto" }}
                      >
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
                  </Stack>
                </motion.form>
              )}
            </AnimatePresence>
            <MotionDivider layout flexItem />
            <Chats />
          </Stack>
          <Modal
            aria-labelledby="new chat"
            aria-describedby="modal-modal-description"
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          >
            {!loading && data !== undefined ? (
              <>
                <Box sx={modalStyles}>
                  <Stack spacing={2}>
                    <Typography variant="h6" component="h2">
                      {data.findUserByUsername && data.findUserByUsername.user
                        ? "Found 😊"
                        : "Error!"}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                      {data.findUserByUsername && data.findUserByUsername.user
                        ? "User added successfully."
                        : data.findUserByUsername.error.message}
                    </Typography>
                    {data.findUserByUsername && data.findUserByUsername.user && (
                      <>
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
                      </>
                    )}
                  </Stack>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  ...modalStyles,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
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
