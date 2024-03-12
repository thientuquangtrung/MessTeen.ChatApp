import { Box, CircularProgress, Stack, useTheme } from '@mui/material';
import React from 'react';
import Message from './Message';
import Header from './Header';
import Footer from './Footer';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { FetchMoreMessages } from '../../redux/conversation/convActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from "../../hooks/useResponsive";

const Conversation = () => {
    const isMobile = useResponsive("between", "md", "xs", "sm");
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isFetching, setIsFetching, elementRef] = useInfiniteScroll(fetchMoreListItems, 'up');
    const { room_id } = useSelector((state) => state.app);

    function fetchMoreListItems() {
        dispatch(
            FetchMoreMessages(room_id, () => {
                setIsFetching(false);
            }),
        );
    }

    return (
        <Stack height="100%" maxHeight="100vh" width={isMobile ? "100vw" : "auto"}>
            {/* Chat Header */}
            <Header />
            {/* Msg */}
            <Box
                ref={elementRef}
                width={'100%'}
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflowY: 'scroll',
                    backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.paper,
                }}
            >
                {isFetching && (
                    <Box textAlign={'center'} width={'100%'} my={1}>
                        <CircularProgress />
                    </Box>
                )}
                <Message isMobile={isMobile}/>
            </Box>
            {/* Chat Footer*/}
            <Footer />
        </Stack>
    );
};

export default Conversation;
