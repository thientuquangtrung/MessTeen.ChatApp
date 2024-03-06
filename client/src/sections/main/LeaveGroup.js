import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React from 'react';
import FormProvider from '../../components/hook-form/FormProvider';
import { socket } from '../../socket';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const user_id = window.localStorage.getItem('user_id');

const LeaveGroup = ({ open, handleClose }) => {
    const { current_conversation } = useSelector((state) => state.conversation);

    const handleLeaveGroup = () => {
        socket.emit('leave_group', { from: user_id, conversation_id: current_conversation.id });
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

export default LeaveGroup;
