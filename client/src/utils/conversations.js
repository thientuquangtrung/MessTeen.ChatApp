export const getFormattedConversation = (conversationBE, user_id) => {
    if (conversationBE.room_type === 'PRIVATE') {
        const user = conversationBE.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
        return {
            id: conversationBE._id,
            user_id: user?._id,
            name: `${user?.usr_name}`,
            online: user?.usr_status !== 'OFFLINE' && user.usr_friends?.includes(user_id),
            img: [user.usr_avatar],
            msg: conversationBE.room_last_msg.content,
            time: conversationBE.room_last_msg.timestamp,
            unread: 0,
            pinned: false,
            about: user?.usr_bio,
            type: conversationBE.room_type,
            isBeingBlocked: user.usr_blocked_people.includes(user_id),
            participant_ids: conversationBE.room_participant_ids.map((participant) => participant._id),
        };
    } else {
        const participantDetails = conversationBE.room_participant_ids.map((user) => ({
            user_id: user._id,
            name: user.usr_name,
            img: user.usr_avatar,
            online: user.usr_status !== 'OFFLINE',
        }));
        return {
            id: conversationBE._id,
            name: conversationBE.room_title,
            online: conversationBE.room_participant_ids.some((user) => user.usr_status !== 'OFFLINE'),
            img: conversationBE.room_participant_ids.map((user) => user.usr_avatar),
            msg: conversationBE.room_last_msg.content,
            time: conversationBE.room_last_msg.timestamp,
            room_owner_id: conversationBE.room_owner_id,
            unread: 0,
            pinned: false,
            type: conversationBE.room_type,
            participant_ids: conversationBE.room_participant_ids.map((participant) => participant._id),
            participant_details: participantDetails,
        };
    }
};

export const getFormattedMessage = (messageBE, user_id) => {
    let subtype = messageBE.msg_parent_id ? 'reply' : messageBE.msg_type;
    if (subtype === 'IMAGE') {
        subtype = 'img';
    }
    return {
        id: messageBE._id,
        type: 'msg',
        subtype: subtype,
        message: messageBE.msg_content,
        incoming: messageBE.msg_sender_id._id !== user_id,
        outgoing: messageBE.msg_sender_id_id === user_id,
        timestamp: messageBE.msg_timestamp,
        reactions: messageBE.msg_reactions.map((reaction) => reaction.reaction),
        msgReply: messageBE.msg_parent_id,
        user_name: messageBE.msg_sender_id.usr_name,
        fileURL: messageBE.msg_media_url,
    };
};
