import React from "react";
import Chats from "./Chats";
import { Box, Stack, useTheme } from "@mui/material";

import Conversation from "../../components/Conversation";

const GeneralApp = () => {
  const theme=useTheme();

  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/* chats */}
      <Chats />

      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 420px)",
          backgroundColor: theme.palette.mode==="light" ? "#fff" : theme.palette.background.paper,
          backgroundColor: theme.palette.mode==="light" ? "#fff" : theme.palette.background.paper,
        }}
      >
        {/* conversations */}
        <Conversation/>
      </Box>
    </Stack>
  );
};

export default GeneralApp;
