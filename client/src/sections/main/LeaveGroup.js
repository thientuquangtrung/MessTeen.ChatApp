import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React from 'react';

import { socket } from '../../socket';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const user_id = window.localStorage.getItem('user_id');

const LeaveGroup = ({ open, handleClose }) => {
    const { current_conversation } = useSelector((state) => state.conversation);

    const handleLeaveGroup = () => {
        socket.emit('leave_group', {
            from: user_id,
            conversation_id: current_conversation.id,
            room_owner_id: current_conversation.room_owner_id,
        });
        handleClose();
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} TransitionComponent={Transition} keepMounted sx={{ p: 4 }}>
            {/* Title */}
            <DialogTitle sx={{ mb: 3, textAlign: 'center' }}>Do you want to leave group?</DialogTitle>
            {/* Content */}
            <DialogContent>
                {/* Form */}
                {/* <LeaveGroupForm handleClose={handleClose} /> */}

                <Stack spacing={3}>
                    <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleLeaveGroup} variant="contained">
                            Leave Group
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
const RemoveUser = ({ open, handleClose, toKickId, userName }) => {
    const { current_conversation } = useSelector((state) => state.conversation);
    const handleKick = (user_kicked_id) => {
        socket.emit('kick_from_group', { to: user_kicked_id, conversation_id: current_conversation.id, from: user_id });
        handleClose();
    };

    return (
        <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted sx={{ p: 4 }}>
            {/* Title */}
            <DialogTitle sx={{ mb: 3, textAlign: 'center' }}>Do you want to remove {userName} ?</DialogTitle>
            {/* Content */}
            <DialogContent>
                {/* Form */}
                {/* <LeaveGroupForm handleClose={handleClose} /> */}

                <Stack spacing={3}>
                    <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => handleKick(toKickId)} variant="contained">
                            Yes
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveUser, LeaveGroup };
