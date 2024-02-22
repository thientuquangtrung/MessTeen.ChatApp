import React from 'react';
import Chats from './Chats';
import { Box, Stack, Typography, useTheme } from '@mui/material';

import Conversation from '../../components/Conversation';
import Contact from '../../components/Contact';
import { useSelector } from 'react-redux';

import NoChatSVG from "../../assets/Illustration/NoChat"
import NoChat from '../../assets/Illustration/NoChat';

const GeneralApp = () => {
    const theme = useTheme();
    const { sidebar, chat_type, room_id } = useSelector((store) => store.app);

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
                {room_id !== null && chat_type === 'individual' ? (
                    <Conversation />
                ) : (
                    <Stack
                        spacing={2}
                        sx={{ height: '100%', width: '100%' }}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <NoChatSVG/>
                        <Typography variant='subtitle2'>Select a conversation or start new one</Typography>
                    </Stack>
                )}
                {/* conversations */}
            </Box>
            <Contact />
        </Stack>
    );
};

export default GeneralApp;
