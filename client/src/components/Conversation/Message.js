import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chat_History } from '../../data';
import { FetchCurrentMessages, SetCurrentConversation } from '../../redux/conversation/convActionCreators';
import { socket } from '../../socket';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline } from './MsgTypes';

const Message = ({ isMobile, menu }) => {
    const dispatch = useDispatch();
    const { conversations, current_messages, message_page } = useSelector((state) => state.conversation);
    const { room_id } = useSelector((state) => state.app);

    const pageRef = useRef(message_page);
    const messagesRef = useRef(current_messages);
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const current = conversations.find((el) => el?.id === room_id);

        if (current) {
            socket.emit('get_messages', { conversation_id: current?.id }, (data) => {
                dispatch(FetchCurrentMessages({ messages: data }));
            });

            dispatch(SetCurrentConversation(current));
        }

        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [room_id]);

    useEffect(() => {
        // Kéo thanh cuộn xuống dưới khi có tin nhắn mới
        if (messagesEndRef.current && current_messages?.length > messagesRef.current?.length) {
            if (pageRef.current && pageRef.current === message_page) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                messagesRef.current = current_messages;
            } else {
                pageRef.current = message_page;
            }
        }
    }, [current_messages]);

    return (
        <Box p={isMobile ? 1 : 3}>
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
