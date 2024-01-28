import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

import Message from "./Message";
import Header from "./Header";
import styled from "@emotion/styled";
import { LinkSimple, PaperPlaneTilt, Smiley } from "phosphor-react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important" ,
    paddingBottom: "12px !important",
  },
}));

const Conversation = () => {
  const theme = useTheme();
  return (
    <Stack height="100%" maxHeight="100vh" width={"auto"}>
      {/* Chat Header */}
      <Header />
      {/* Msg */}
      <Box
      
        width={"100%"}
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll",backgroundColor: theme.palette.mode==="light" ? "F8FAFF":theme.palette.background.paper }}
      >
        <Message />
      </Box>
      {/* Chat Footer*/}
      <Box
        p={2}
        sx={{
          
          width: "100%",
          backgroundColor: theme.palette.mode==="light" ? "F8FAFF":theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={3}>
          <StyledInput
            fullWidth
            placeholder="Write a message..."
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment>
                  <IconButton>
                    <LinkSimple />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <Smiley />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent="center"
            >
              {" "}
              <IconButton>
                <PaperPlaneTilt color="white"/>
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Conversation;
