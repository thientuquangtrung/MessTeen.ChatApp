import React, { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Slide, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket';
import { ResetVideoCallQueue } from '../../../redux/videoCall/videoCallActionCreators';
import { PhoneSlash } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import PaperComponent from '../../../components/PaperComponent';
import Peer from 'peerjs';
import { showSnackbar } from '../../../redux/app/appActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CallDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();

    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerInstance = useRef(null);

    //* Use params from call_details if available => like in case of receiver's end
    /**
     * call_details {
     *      from : id of user who the stream comes from
     *      to : id of user who the stream to
     *      roomID: id of this call
     *      streamID: id of stream (usually === from)
     *      userID: id of user receiving the stream (usually === to)
     * }
     */
    const [call_details] = useSelector((state) => state.videoCall.call_queue);
    const { incoming } = useSelector((state) => state.videoCall);
    const { user } = useSelector((state) => state.app);

    const roomID = call_details?.roomID;
    const userID = call_details?.userID;

    useEffect(() => {
        // for all users in call
        socket.on('video_call_end', (data) => {
            handleDisconnect();
        });

        const peer = new Peer(userID);
        peerInstance.current = peer;
        console.log(`peerInstance`, peer);

        peer.on('open', (id) => {
            console.log('My peer id:::::', id);
            if (!incoming) {
                socket.emit('start_video_call', {
                    to: call_details?.streamID,
                    from: userID,
                    roomID,
                });
            } else {
                socket.emit('video_call_accepted', { ...call_details });
            }
        });

        peer.on('error', (error) => {
            console.error('Peer connection error:', error);
            dispatch(showSnackbar({ severity: 'error', message: 'Peer connection error' }));
            handleEndVideoCall();
        });

        peer.on('error', (error) => {
            console.error('Peer connection error:', error);
            dispatch(showSnackbar({ severity: 'error', message: 'Peer connection error' }));
            handleEndVideoCall();
        });

        if (!incoming) {
            //caller

            // // create a job to decline call automatically after 30 sec if not picked
            const notPickTimer = setTimeout(() => {
                // TODO => You can play an audio indicating missed call at this line at sender's end
                socket.emit('video_call_not_picked', { to: call_details?.streamID, from: userID, roomID }, () => {
                    // TODO abort call => Call verdict will be marked as Missed
                });

                handleDisconnect();
            }, 30 * 1000);

            socket.on('video_call_denied', () => {
                // TODO => You can play an audio indicating call is denined
                // ABORT CALL
                clearTimeout(notPickTimer);
                handleDisconnect();
            });

            socket.on('on_another_video_call', () => {
                // TODO => You can play an audio indicating call is denined
                // ABORT CALL
                dispatch(showSnackbar({ severity: 'warning', message: 'User is on another call!' }));
                clearTimeout(notPickTimer);
                handleDisconnect();
            });

            socket.on('video_call_accepted', () => {
                // TODO => You can play an audio indicating call is started
                // clear timeout for "video_call_not_picked"
                clearTimeout(notPickTimer);
                makeCall(call_details?.streamID);
            });

            const makeCall = (remotePeerId) => {
                // caller
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((mediaStream) => {
                        addVideoStream(localVideoRef.current, mediaStream);
                        const call = peer.call(remotePeerId, mediaStream);

                        call.on('stream', (remoteStream) => {
                            addVideoStream(remoteVideoRef.current, remoteStream);
                        });

                        call.on('close', () => {
                            console.log(`call close:::::`);
                        });
                    })
                    .catch((err) => {
                        console.error('Failed to get local stream', err);
                        dispatch(showSnackbar({ severity: 'error', message: 'Failed to get local stream' }));
                        handleEndVideoCall();
                    });
            };
        } else {
            // receiver
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((mediaStream) => {
                    addVideoStream(localVideoRef.current, mediaStream);

                    peer.on('call', (call) => {
                        call.answer(mediaStream);
                        call.on('stream', function (remoteStream) {
                            addVideoStream(remoteVideoRef.current, remoteStream);
                        });
                        call.on('close', () => {
                            console.log(`call close:::::`);
                        });
                    });
                })
                .catch((err) => {
                    console.error('Failed to get local stream', err);
                    dispatch(showSnackbar({ severity: 'error', message: 'Failed to get local stream' }));
                    handleEndVideoCall();
                });
        }
    }, []);

    const handleDisconnect = (event, reason) => {
        if (reason && reason === 'backdropClick') {
            return;
        } else {
            // clean up event listners
            socket?.off('video_call_accepted');
            socket?.off('video_call_denied');
            socket?.off('on_another_video_call');
            socket?.off('video_call_end');

            // stop publishing local audio & video stream to remote users, call the stopPublishingStream method with the corresponding stream ID passed to the streamID parameter.
            localVideoRef.current?.srcObject?.getTracks()?.forEach(function (track) {
                track.stop();
            });
            remoteVideoRef.current?.srcObject?.getTracks()?.forEach(function (track) {
                track.stop();
            });

            // handle Call Disconnection => this will be handled as cleanup when this dialog unmounts
            console.log(`destroy peer instance::::`, peerInstance.current);
            peerInstance.current?.destroy();

            // at the end call handleClose Dialog
            dispatch(ResetVideoCallQueue());
            handleClose();
        }
    };

    const handleEndVideoCall = () => {
        socket.emit('end_video_call', { from: userID, to: call_details?.streamID, roomID });
        handleDisconnect();
    };

    const addVideoStream = (video, stream) => {
        try {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        } catch (error) {
            console.error('Error adding video stream:', error);
        }
    };

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
                    <Stack height={'450px'}>
                        <video
                            poster={call_details.from?.usr_avatar || faker.image.city()}
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
                            poster={user?.usr_avatar || faker.image.animals()}
                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                            ref={localVideoRef}
                            id="local-video"
                            controls={false}
                        />
                        {/* <audio id="local-audio" controls={false} /> */}
                    </Stack>
                    <Button
                        onClick={handleEndVideoCall}
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
