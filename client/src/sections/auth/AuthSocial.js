import { Divider, IconButton, Stack } from "@mui/material";
import { GoogleLogo } from "phosphor-react";
import React from "react";

const AuthSocial = () => {
  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, ::after": {
            borderTopStyle: "dashed",
          },
        }}
      >
        OR
      </Divider>
      <Stack direction={"row"} justifyContent={"center"} spacing={2}>
        <IconButton>
            <GoogleLogo color="#df3e30"/>
        </IconButton>
      </Stack>
    </div>
  );
};

export default AuthSocial;
