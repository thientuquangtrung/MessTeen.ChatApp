import { faker } from '@faker-js/faker';
import { Avatar, Button, Dialog, DialogActions, DialogContent, Slide, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket';
import { PhoneIncoming, PhoneX } from 'phosphor-react';
import Arrow from '../../../assets/Illustration/Arrow';
import { ResetVideoCallQueue, UpdateVideoCallDialog } from '../../../redux/videoCall/videoCallActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.app);
    const [call_details] = useSelector((state) => state.videoCall.call_queue);

    useEffect(() => {
        socket.on('video_call_missed', () => {
            // TODO => You can play an audio indicating call is missed at receiver's end
            // Abort call
            dispatch(ResetVideoCallQueue());
        });

        socket.on('video_call_end', () => {
            dispatch(ResetVideoCallQueue());
        });

        return () => {
            console.log(`clean up:::::::::`);
            socket?.off('video_call_missed');
            socket?.off('video_call_end');
        };
    }, []);

    const handleAccept = () => {
        dispatch(UpdateVideoCallDialog({ state: true }));
    };

    const handleDeny = () => {
        socket.emit('video_call_denied', { ...call_details });
        dispatch(ResetVideoCallQueue());
    };

    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                // keepMounted
                onClose={handleDeny}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Stack direction="row" alignItems={'center'} p={2}>
                        <Stack>
                            <Avatar sx={{ height: 100, width: 100 }} src={call_details.from?.usr_avatar} />
                        </Stack>
                        <Arrow />
                        <Stack>
                            <Avatar sx={{ height: 100, width: 100 }} src={user?.usr_avatar} />
                        </Stack>
                    </Stack>
                    <Typography mt={2} textAlign={'center'} variant={'h6'}>
                        {call_details.from?.usr_name} is making a video call...
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button startIcon={<PhoneIncoming />} onClick={handleAccept} variant="contained" color="success">
                        Accept
                    </Button>
                    <Button startIcon={<PhoneX />} onClick={handleDeny} variant="contained" color="error">
                        Deny
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CallNotification;
