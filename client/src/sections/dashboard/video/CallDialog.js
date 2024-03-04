import React, { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Slide, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
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

    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerInstance = useRef(null);

    //* Use params from call_details if available => like in case of receiver's end

    const [call_details] = useSelector((state) => state.videoCall.call_queue);
    const { incoming } = useSelector((state) => state.videoCall);

    // roomID => ID of conversation => current_conversation.id
    // userID => ID of this user

    const roomID = call_details?.roomID;
    const userID = call_details?.userID;

    const handleDisconnect = (event, reason) => {
        if (reason && reason === 'backdropClick') {
            return;
        } else {
            // clean up event listners
            socket?.off('video_call_accepted');
            socket?.off('video_call_denied');
            // socket?.off('video_call_missed');

            // stop publishing local audio & video stream to remote users, call the stopPublishingStream method with the corresponding stream ID passed to the streamID parameter.

            // handle Call Disconnection => this will be handled as cleanup when this dialog unmounts
            peerInstance.current?.destroy();

            // at the end call handleClose Dialog
            dispatch(ResetVideoCallQueue());
            handleClose();
        }
    };

    useEffect(() => {
        if (!incoming) {
            //caller
            socket.emit('start_video_call', {
                to: call_details?.streamID,
                from: userID,
                roomID,
            });

            // // create a job to decline call automatically after 30 sec if not picked
            const notPickTimer = setTimeout(() => {
                // TODO => You can play an audio indicating missed call at this line at sender's end
                socket.emit('video_call_not_picked', { to: call_details?.streamID, from: userID }, () => {
                    // TODO abort call => Call verdict will be marked as Missed
                });

                handleDisconnect();
            }, 10 * 1000);

            // socket.on('video_call_missed', () => {
            //     // TODO => You can play an audio indicating call is missed at receiver's end
            //     // Abort call
            //     handleDisconnect();
            // });

            socket.on('video_call_denied', () => {
                // TODO => You can play an audio indicating call is denined
                // ABORT CALL
                clearTimeout(notPickTimer);
                handleDisconnect();
            });

            socket.on('on_another_video_call', () => {
                // TODO => You can play an audio indicating call is denined
                // ABORT CALL
                clearTimeout(notPickTimer);
                handleDisconnect();
            });

            socket.on('video_call_accepted', () => {
                // TODO => You can play an audio indicating call is started
                // clear timeout for "video_call_not_picked"
                clearTimeout(notPickTimer);

                //
                makeCall(call_details?.streamID);
            });
        }

        socket.on('video_call_end', (data) => {
            handleDisconnect();
        });

        const peer = new Peer(userID);
        peerInstance.current = peer;
        console.log(`peerInstance`, peer);

        peer.on('open', (id) => {
            console.log('My peer id:::::', id);
        });

        peer.on('call', (call) => {
            console.log('on call:::::::', userID);
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((mediaStream) => {
                    localVideoRef.current.srcObject = mediaStream;
                    localVideoRef.current.play();

                    call.answer(mediaStream);
                    call.on('stream', function (remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    });
                    call.on('close', () => {
                        console.log(`call close:::::`);
                        localVideoRef.current?.srcObject.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        remoteVideoRef.current?.srcObject.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    });
                })
                .catch((err) => {
                    console.error('Failed to get local stream', err);
                });
        });

        const makeCall = (remotePeerId) => {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((mediaStream) => {
                    localVideoRef.current.srcObject = mediaStream;
                    localVideoRef.current.play();
                    const call = peer.call(remotePeerId, mediaStream);

                    console.log(`call:::::`, call);
                    call.on('stream', (remoteStream) => {
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play();
                    });

                    call.on('close', () => {
                        console.log(`call close:::::`);
                        localVideoRef.current?.srcObject.getTracks().forEach(function (track) {
                            track.stop();
                        });
                        remoteVideoRef.current?.srcObject.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    });
                })
                .catch((err) => {
                    console.error('Failed to get local stream', err);
                });
        };
    }, []);

    return (
        <>
            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Transition}
                // keepMounted
                // onClose={handleDisconnect}
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
                            poster={faker.image.city()}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            ref={remoteVideoRef}
                            id="remote-video"
                            controls={false}
                        />
                        {/* <audio id="remote-audio" controls={false} /> */}
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
                            poster={faker.image.animals()}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            ref={localVideoRef}
                            id="local-video"
                            controls={false}
                        />
                        {/* <audio id="local-audio" controls={false} /> */}
                    </Stack>
                    <Button
                        onClick={() => {
                            socket.emit('end_video_call', { from: userID, to: call_details?.streamID });
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
            </Dialog>
        </>
    );
};

export default CallDialog;
