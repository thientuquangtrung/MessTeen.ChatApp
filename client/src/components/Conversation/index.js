import { Avatar, Badge, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { faker } from "@faker-js/faker";
import { styled } from "@mui/material/styles";
import Message from "./Message";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700", 
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Conversation = () => {
  return (
    <Stack height="100%" maxHeight="100vh" width={"auto"}>
      {/* Chat Header */}
      <Box
      p={2}
        sx={{
          height: 100,
          width: "100%",
          backgroundColor: "#f8faff",
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ width: "100%", height: "100%" }}
        >
          <Stack direction={"row"} spacing={2}>
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={faker.name.fullName()}
                  src={faker.image.avatar()}
                />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {faker.name.fullName()}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {/* Msg */}
      <Box width={"100%"} sx={{ flexGrow: 1, height:"100%", overflowY:"scroll" }}>
        <Message/>
      </Box>
      {/* Chat Footer*/}
      <Box
        sx={{
          height: 100,
          width: "100%",
          backgroundColor: "#f8faff",
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      ></Box>
    </Stack>
  );
};

export default Conversation;
