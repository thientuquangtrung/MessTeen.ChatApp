import React, { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Slide, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../utils/axios';
import { socket } from '../../../socket';
import { ResetVideoCallQueue } from '../../../redux/videoCall/videoCallActionCreators';
import { PhoneSlash } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import PaperComponent from '../../../components/PaperComponent';
import Peer from 'peerjs';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();

    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerInstance = useRef(null);

    //* Use params from call_details if available => like in case of receiver's end

    const [call_details] = useSelector((state) => state.videoCall.call_queue);
    const { incoming } = useSelector((state) => state.videoCall);

    // roomID => ID of conversation => current_conversation.id
    // token => generate on backend & get on App
    // userID => ID of this user
    // userName => slug formed by user's name

    const roomID = call_details?.roomID;
    const userID = call_details?.userID;
    const userName = call_details?.userName;

    const handleDisconnect = (event, reason) => {
        if (reason && reason === 'backdropClick') {
            return;
        } else {
            // clean up event listners
            socket?.off('video_call_accepted');
            socket?.off('video_call_denied');
            socket?.off('video_call_missed');

            // stop publishing local audio & video stream to remote users, call the stopPublishingStream method with the corresponding stream ID passed to the streamID parameter.

            // handle Call Disconnection => this will be handled as cleanup when this dialog unmounts

            // at the end call handleClose Dialog
            dispatch(ResetVideoCallQueue());
            handleClose();
        }
    };

    useEffect(() => {
        // create a job to decline call automatically after 30 sec if not picked
        const timer = setTimeout(() => {
            // TODO => You can play an audio indicating missed call at this line at sender's end
            socket.emit('video_call_not_picked', { to: call_details?.streamID, from: userID }, () => {
                // TODO abort call => Call verdict will be marked as Missed
            });
        }, 30 * 1000);

        socket.on('video_call_missed', () => {
            // TODO => You can play an audio indicating call is missed at receiver's end
            // Abort call
            handleDisconnect();
        });

        socket.on('video_call_accepted', () => {
            // TODO => You can play an audio indicating call is started
            // clear timeout for "video_call_not_picked"
            clearTimeout(timer);
        });

        if (!incoming) {
            socket.emit('start_video_call', {
                to: call_details?.streamID,
                from: userID,
                roomID,
            });
        }

        socket.on('video_call_denied', () => {
            // TODO => You can play an audio indicating call is denined
            // ABORT CALL
            handleDisconnect();
        });

        const peer = new Peer(userID);

        peer.on('open', (id) => {
            console.log('peer id:::::', id, userID);
            setPeerId(id);
        });

        peer.on('call', (call) => {
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            console.log('on call:::::::', userID);
            getUserMedia({ video: true, audio: true }, (mediaStream) => {
                localVideoRef.current.srcObject = mediaStream;
                localVideoRef.current.play();
                call.answer(mediaStream);
                call.on('stream', function (remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.play();
                });
            });
        });

        peerInstance.current = peer;

        if (incoming) {
            makeCall(call_details?.streamID);
        }
    }, []);

    const makeCall = (remotePeerId) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            localVideoRef.current.srcObject = mediaStream;
            localVideoRef.current.play();

            console.log(`remotePeerId::::::`, remotePeerId);
            const call = peerInstance.current.call(remotePeerId, mediaStream);

            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
            });

            // TODO: handle close
        });
    };

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDisconnect}
                aria-describedby="alert-dialog-slide-description"
                hideBackdrop
                PaperComponent={PaperComponent}
                sx={{
                    '.MuiPaper-root': { margin: 0, pointerEvents: 'auto' },
                    '&:hover': { cursor: 'all-scroll' },
                }}
                style={{ pointerEvents: 'none' }}
                disableEnforceFocus
            >
                <DialogContent sx={{ p: 0 }}>
                    <Stack>
                        <video
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            ref={remoteVideoRef}
                            id="remote-video"
                            controls={false}
                        />
                        {/* <audio id="remote-audio" controls={false} /> */}
                        {/* <img draggable={false} src={faker.image.city()} /> */}
                    </Stack>
                    <Stack
                        position={'absolute'}
                        top={'4px'}
                        right={'4px'}
                        width={'35%'}
                        height={'35%'}
                        borderRadius={'16px'}
                        overflow={'hidden'}
                    >
                        <video
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            ref={localVideoRef}
                            id="local-video"
                            controls={false}
                        />
                        {/* <audio id="local-audio" controls={false} /> */}
                        {/* <img draggable={false} src={faker.image.animals()} /> */}
                    </Stack>
                    <Button
                        onClick={() => {
                            handleDisconnect();
                        }}
                        variant="contained"
                        color="error"
                        // size="large"
                        sx={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <PhoneSlash size={24} />
                    </Button>
                </DialogContent>
                {/* <DialogActions>
                    <IconButton
                        onClick={() => {
                            handleDisconnect();
                        }}
                        color="error"
                    >
                        <PhoneSlash />
                    </IconButton>
                </DialogActions> */}
            </Dialog>
        </>
    );
};

export default CallDialog;
