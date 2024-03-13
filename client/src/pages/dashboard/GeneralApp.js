import React from 'react';
import Chats from './Chats';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import Conversation from '../../components/Conversation';
import Contact from '../../components/Contact';
import { useSelector } from 'react-redux';
import NoChatSVG from '../../assets/Illustration/NoChat';
import NoChat from '../../assets/Illustration/NoChat';

const GeneralApp = () => {
    const theme = useTheme();
    const { sidebar, chat_type, room_id } = useSelector((store) => store.app); //use destructor to get the value of the object

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
                {room_id !== null ? (
                    <Conversation />
                ) : (
                    <Stack
                        spacing={2}
                        sx={{ height: '100%', width: '100%' }}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <NoChatSVG />
                        <Typography variant="subtitle2">Select a conversation or start new one</Typography>
                    </Stack>
                )}
                {/* conversations */}
            </Box>
            {room_id !== null && sidebar.open && <Contact />}
        </Stack>
    );
};

export default GeneralApp;
