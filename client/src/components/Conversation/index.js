import { Box, Stack, useTheme } from '@mui/material';
import React from 'react';
import Message from './Message';
import Header from './Header';
import Footer from './Footer';

const Conversation = () => {
    const theme = useTheme();
    return (
        <Stack height="100%" maxHeight="100vh" width="auto">
            {/* Chat Header */}
            <Header />
            {/* Msg */}
            <Box
                width={'100%'}
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflowY: 'scroll',
                    backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.paper,
                }}
            >
                <Message />
            </Box>
            {/* Chat Footer*/}
            <Footer />
        </Stack>
    );
};

export default Conversation;
