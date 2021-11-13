import { Avatar, Typography, Stack, IconButton } from "@mui/material";
import { GET_USER_BY_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_MESSAGE } from "../utils/mutations";

const Message = ({
  timestamp,
  sender,
  message,
  index,
  chatId,
}: {
  message: string;
  sender: string;
  timestamp: Date;
  index: number;
  chatId: string;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [deleteMsg] = useMutation(DELETE_MESSAGE);
  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { Id: sender },
  });

  return (
    <>
      {!loading && data.getUserByID.user && (
        <div
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar>{data.getUserByID.user.username[0].toUpperCase()}</Avatar>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                <Typography variant="subtitle1">
                  {data.getUserByID.user.username}
                </Typography>
                <Typography variant="caption" color="darkgrey">
                  {moment(Number(timestamp)).format("MMM D[,] YY h:mm")}
                </Typography>
                {showOptions && (
                  <IconButton
                    onClick={() => deleteMsg({ variables: { chatId, index } })}
                    size="small"
                  >
                    <DeleteIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                )}
              </Stack>
              <Typography color="#eee" variant="body2">
                {message}
              </Typography>
            </Stack>
          </Stack>
        </div>
      )}
    </>
  );
};

export default Message;
