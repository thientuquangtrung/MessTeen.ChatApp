import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chat_History } from '../../data';
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/conversation/convActionCreators';
import { socket } from '../../socket';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes';

const Message = () => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null); // Tham chiếu đến phần tử cuối cùng của Stack

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
        // Kéo thanh cuộn xuống dưới khi có tin nhắn mới
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
                            return <Timeline el={el} />;
                        case 'msg':
                            switch (el.subtype) {
                                case 'img':
                                    return <MediaMsg el={el} />;
                                case 'doc':
                                    return <DocMsg el={el} />;
                                case 'link':
                                    return <LinkMsg el={el} />;
                                case 'reply':
                                    return <ReplyMsg el={el} />;
                                default:
                                    //text msg
                                    return <TextMsg el={el} />;
                            }

                        default:
                            return <></>;
                    }
                })}
                <div ref={messagesEndRef} /> {/* Phần tử cuối cùng của Stack */}
            </Stack>
        </Box>
    );
};

export default Message;
