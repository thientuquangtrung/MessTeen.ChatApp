import { Box, useTheme,Stack, Avatar ,Typography, IconButton, Divider } from '@mui/material'

import { faker } from "@faker-js/faker";
import React from 'react'
import StyledBadge from '../settings/StyledBadge';
import { CaretDown, Divide, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';

const Header = () => {
    const theme= useTheme();
  return (
    <Box
      p={2}
        sx={{
          height: 100,
          width: "100%",
          backgroundColor: theme.palette.mode==="light" ? "F8FAFF":theme.palette.background.paper,
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
          <Stack direction="row" alignItems={"center"} spacing={3}>
<IconButton>
    <VideoCamera/>
</IconButton>
<IconButton>
    <Phone/>
</IconButton>
<IconButton>
    <MagnifyingGlass/>
</IconButton>
<Divider orientation='vertical' flexItem/>
<IconButton>
    <CaretDown/>
</IconButton>
          </Stack>
        </Stack>
      </Box>
  )
}

export default Header