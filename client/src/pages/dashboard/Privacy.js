import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretLeft, CaretRight } from "phosphor-react";

const Privacy = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleBlockContactsClick = () => {
    navigate("/settings/privacy/block-contacts");
  };

  const handleBackSettings = () => {
    navigate("/settings");
  };

  const list = [
    {
      key: 0,
      title: "Last Seen",
      onclick: () => {},
      disabled: true,
      caption: "Everyone",
    },
    {
      key: 1,
      title: "Profile Photo",
      onclick: () => {},
      disabled: true,
      caption: "Everyone",
    },
    {
      key: 2,
      title: "About",
      onclick: () => {},
      disabled: true,
      caption: "Everyone",
    },
    {
      key: 3,
      title: "Read receipts",
      caption:
        "if turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.",
      onclick: () => {},
      disabled: true,
      isCheckbox: true,
    },
    {
      key: 4,
      title: "Groups",
      onclick: () => {},
      disabled: true,
      caption: "Everyone",
    },
    {
      key: 5,
      title: "Block Contacts",
      onclick: handleBlockContactsClick,
      disabled: false,
      caption: "9",
    },
  ];

  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* LeftPanel */}
        <Box
          sx={{
            height: "100vh",
            width: 320,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f8faff"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <IconButton onClick={handleBackSettings}>
                <CaretLeft size={24} color="#4b4b4b" />
              </IconButton>
              <Typography variant="h4">Privacy</Typography>
            </Stack>
            {/* List of options */}
            <Stack
              sx={{
                maxHeight: "calc(100vh - 150px)", 
                overflowY: "auto", 
                paddingBottom:1
              }}
              spacing={2.5}
            >
              {list.map((option, index) => (
                <Stack
                  spacing={1}
                  key={option.key}
                  // style={{ opacity: option.disabled ? 0.5 : 1 }}
                  sx={{
                    cursor: option.disabled ? "default" : "pointer", // Thay đổi kiểu con trỏ chuột
                    opacity: option.disabled ? 0.5 : 1,
                  }}
                >
                  <Grid container direction={"row"} alignItems="center">
                    <Grid item xs={8}>
                      <Stack spacing={1}>
                        <Typography variant="h6">{option.title}</Typography>
                        <Typography variant="caption">
                          {option.caption}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} style={{ textAlign: "right" }}>
                      {option.isCheckbox ? (
                        <FormControlLabel
                          control={<Checkbox checked={!option.disabled} />}
                          label=""
                          labelPlacement="start"
                          disabled={option.disabled}
                          sx={{ margin: "auto" }} // Căn chỉnh checkbox sang phải
                        />
                      ) : (
                        <IconButton
                          onClick={option.onclick}
                          disabled={option.disabled}
                        >
                          <CaretRight size={24} color="#4b4b4b" />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                  {index < list.length - 1 && <Divider />}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default Privacy;
