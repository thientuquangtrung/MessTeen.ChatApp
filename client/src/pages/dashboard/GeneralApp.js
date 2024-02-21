import React from 'react';
import Chats from './Chats';
import { Box, Stack, useTheme } from '@mui/material';

import Conversation from '../../components/Conversation';
import Contact from '../../components/Contact';
import { useSelector } from 'react-redux';

const GeneralApp = () => {
    const theme = useTheme();
    const app = useSelector((store) => store.app); // it return the object that contain sidebar
    console.log(app, 'app');
    const { sidebar } = useSelector((store) => store.app); //use destructor to get the value of the object
    console.log(sidebar);
    return (
        <Stack direction={'row'} sx={{ width: '100%' }}>
            {/* chats */}
            <Chats />

            <Box
                sx={{
                    height: '100%',
                    width: sidebar.open ? 'calc(100vw - 740px)' : 'calc(100vw - 420px)',
                    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
                }}
            >
                {/* conversations */}
                <Conversation />
            </Box>
            {sidebar.open && <Contact />}
        </Stack>
    );
};

export default GeneralApp;
