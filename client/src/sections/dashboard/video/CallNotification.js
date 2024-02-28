import { faker } from '@faker-js/faker';
import { Avatar, Button, Dialog, DialogActions, DialogContent, Slide, Stack, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket';
// import { AWS_S3_REGION, S3_BUCKET_NAME } from '../../../config';
import { PhoneIncoming, PhoneX } from 'phosphor-react';
import Arrow from '../../../assets/Illustration/Arrow';
import {
    CloseVideoNotificationDialog,
    ResetVideoCallQueue,
    UpdateVideoCallDialog,
} from '../../../redux/videoCall/videoCallActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.app);
    const [call_details] = useSelector((state) => state.videoCall.call_queue);

    const handleAccept = () => {
        socket.emit('video_call_accepted', { ...call_details });
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
                keepMounted
                onClose={handleDeny}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Stack direction="row" alignItems={'center'} p={2}>
                        <Stack>
                            <Avatar
                                sx={{ height: 100, width: 100 }}
                                src={faker.image.avatar()}
                                // src={`https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${call_details?.from_user?.avatar}`}
                            />
                        </Stack>
                        <Arrow />
                        <Stack>
                            <Avatar
                                sx={{ height: 100, width: 100 }}
                                src={faker.image.avatar()}
                                // src={`https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`}
                            />
                        </Stack>
                    </Stack>
                    <Typography mt={2} textAlign={'center'} variant={'h6'}>
                        John is making a video call...
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
