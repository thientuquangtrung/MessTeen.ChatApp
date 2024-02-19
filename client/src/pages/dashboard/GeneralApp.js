import React from 'react';
import Chats from './Chats';
import { Box, Stack, useTheme } from '@mui/material';

import Conversation from '../../components/Conversation';
import Contact from '../../components/Contact';

const GeneralApp = () => {
    const theme = useTheme();

    return (
        <Stack direction={'row'} sx={{ width: '100%' }}>
            {/* chats */}
            <Chats />

            <Box
                sx={{
                    height: '100%',
                    width: 'calc(100vw - 740px)',
                    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
                }}
            >
                {/* conversations */}
                <Conversation />
            </Box>
            <Contact />
        </Stack>
    );
};

export default GeneralApp;
