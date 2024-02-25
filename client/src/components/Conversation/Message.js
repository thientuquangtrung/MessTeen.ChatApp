import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/conversation/convActionCreators';
import { socket } from '../../socket';
import { Box, Stack } from '@mui/material';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes';

const Message = () => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);

    const { conversations, current_messages } = useSelector((state) => state.conversation);
    const { room_id } = useSelector((state) => state.app);

    useEffect(() => {
        const current = conversations.find((el) => el?.id === room_id);

        if (current) {
            socket.emit('get_messages', { conversation_id: current?.id }, (data) => {
                dispatch(FetchCurrentMessages({ messages: data }));
            });

            dispatch(SetCurrentConversation(current));
        }
    }, [room_id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [current_messages]);

    return (
        <Box p={3}>
            <Stack spacing={3}>
                {current_messages.map((el) => {
                    switch (el.type) {
                        case 'divider':
                            return <Timeline el={el} key={el.id} />;
                        case 'msg':
                            switch (el.subtype) {
                                case 'img':
                                    return <MediaMsg el={el} key={el.id} />;
                                case 'doc':
                                    return <DocMsg el={el} key={el.id} />;
                                case 'link':
                                    return <LinkMsg el={el} key={el.id} />;
                                case 'reply':
                                    return <ReplyMsg el={el} key={el.id} />;
                                default:
                                    return <TextMsg el={el} key={el.id} />;
                            }

                        default:
                            return <React.Fragment key={el.id} />;
                    }
                })}
                <div ref={messagesEndRef} />
            </Stack>
        </Box>
    );
};

export default Message;
