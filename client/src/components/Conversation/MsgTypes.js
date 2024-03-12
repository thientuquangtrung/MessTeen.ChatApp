import { useTheme } from '@emotion/react';
import { Box, Divider, IconButton, Link, Menu, MenuItem, Popover, Stack, Typography } from '@mui/material';
import { ArrowBendUpLeft, DotsThreeVertical, DownloadSimple, Image, Smiley } from 'phosphor-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { useState } from 'react';
import { Message_options } from '../../data';
import { socket } from '../../socket';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SetReplyMessage } from '../../redux/conversation/convActionCreators';

const Response = ({ el }) => {
    const dispatch = useDispatch();
    const handleReply = () => {
        dispatch(
            SetReplyMessage({
                id: el.id,
                content: el.message,
                // user: el.
            }),
        );
    };
    const { current_conversation, fileURL } = useSelector((state) => state.conversation);
    const { sideBar, room_id } = useSelector((state) => state.app);
    const user_id = window.localStorage.getItem('user_id');

    const handleEmojiSelect = (emojiId) => {
        socket.emit('react_message', {
            messageID: el.id,
            reaction: emojiId,
            conversation_id: room_id,
            from: user_id,
            to: current_conversation.user_id,
            fileURL: fileURL,
        });
        setAnchorEl(null);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const anchorOrigin = el.incoming
        ? { horizontal: 'right', vertical: 'bottom' }
        : { horizontal: 'left', vertical: 'bottom' };
    const transformOrigin = el.incoming
        ? { horizontal: 'left', vertical: 'top' }
        : { horizontal: 'right', vertical: 'top' };

    const theme = useTheme();

    return (
        <Stack direction={el.incoming ? 'row' : 'row-reverse'} alignItems="center" position="relative">
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size="small"
            >
                <Smiley opacity={0.7} size={20} style={{ cursor: 'pointer' }} />
            </IconButton>
            <Popover
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Stack direction="row">
                    <IconButton size="small" onClick={() => handleEmojiSelect('heart')}>
                        <em-emoji id="heart" size="1.2em"></em-emoji>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEmojiSelect('laughing')}>
                        <em-emoji id="laughing" size="1.2em"></em-emoji>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEmojiSelect('open_mouth')}>
                        <em-emoji id="open_mouth" size="1.2em"></em-emoji>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEmojiSelect('cry')}>
                        <em-emoji id="cry" size="1.2em"></em-emoji>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEmojiSelect('angry')}>
                        <em-emoji id="angry" size="1.2em"></em-emoji>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEmojiSelect('+1')}>
                        <em-emoji id="+1" size="1.2em"></em-emoji>
                    </IconButton>
                </Stack>
            </Popover>
            <IconButton size="small" onClick={handleReply}>
                <ArrowBendUpLeft opacity={0.7} />
            </IconButton>
            {/* <MessageOptions el={el} /> */}
            {/* Emoji Picker */}
            {/* <Box
                sx={{
                    display: openPicker ? 'block' : 'none',
                    zIndex: 10,
                    position: 'absolute',
                    top: 50, // Adjust the top position as needed
                    left: 0, // Adjust the left position as needed
                }}
            >
                <Picker theme={theme.palette.mode} data={data.emojis} onEmojiSelect={console.log} />
            </Box> */}
        </Stack>
    );
};
const DocMsg = ({ el }) => {
    const theme = useTheme();
    const [showResponse, setShowResponse] = useState(false);

    return (
        <Stack
            direction="row"
            justifyContent={el.incoming ? 'start' : 'end'}
            onMouseEnter={() => setShowResponse(true)}
            onMouseLeave={() => setShowResponse(false)}
        >
            {el.incoming || (showResponse && <Response el={el} />)}

            <Box
                p={1.5}
                sx={{
                    background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                    borderRadius: 1.5, //1.5*8=12px
                    width: 'max-content',
                }}
            >
                <Stack spacing={2}>
                    <Stack
                        p={2}
                        spacing={3}
                        alignItems="center"
                        direction="row"
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                        }}
                    >
                        <Image size={48} />
                        <Typography variant="caption">Abstract.png</Typography>
                        <IconButton>
                            <DownloadSimple />
                        </IconButton>
                    </Stack>
                    <Typography variant="body2" sx={{ color: el.incoming ? theme.palette.text : '#fff' }}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {el.incoming && showResponse && <Response el={el} />}
        </Stack>
    );
};
const LinkMsg = ({ el }) => {
    const theme = useTheme();
    const [showResponse, setShowResponse] = useState(false);

    return (
        <Stack
            direction="row"
            justifyContent={el.incoming ? 'start' : 'end'}
            onMouseEnter={() => setShowResponse(true)}
            onMouseLeave={() => setShowResponse(false)}
        >
            {el.incoming || (showResponse && <Response el={el} />)}

            <Box
                p={1.5}
                sx={{
                    background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                    borderRadius: 1.5, //1.5*8=12px
                    width: 'max-content',
                }}
            >
                <Stack spacing={2}>
                    <Stack
                        p={2}
                        spacing={3}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                        }}
                    >
                        <img src={el.preview} alt={el.message} style={{ maxHeight: 210, borderRadius: '10px' }} />
                        <Stack spacing={2}>
                            <Typography variant="subtitle2">Create</Typography>
                            <Typography
                                variant="subtitle2"
                                component={Link}
                                sx={{ color: theme.palette.primary.main }}
                                to="//https://www.youtube.com"
                            >
                                www.youtube.com
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                            {el.message}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            {el.incoming && showResponse && <Response el={el} />}
        </Stack>
    );
};

const ReplyMsg = ({ el }) => {
    const theme = useTheme();
    const [showResponse, setShowResponse] = useState(false);
    const { replyMsg } = useSelector((state) => state.conversation);

    return (
        <Stack
            direction="column" // Change direction to column to stack elements vertically
            alignItems={el.incoming ? 'flex-start' : 'flex-end'} // Align items based on message direction
            onMouseEnter={() => setShowResponse(true)}
            onMouseLeave={() => setShowResponse(false)}
            position={'relative'}
        >
            {/* Display username */}
            {el.incoming && (
                <Typography fontSize={12} marginLeft={0.5} color="#737373">
                    {el.user_name}
                </Typography>
            )}
            <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
                <Stack justifyContent={'center'}>{el.incoming || (showResponse && <Response el={el} />)}</Stack>

                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={el.incoming ? '' : 'flex-end'}
                    sx={{
                        borderRadius: 1.5, //1.5*8=12px
                    }}
                >
                    <Stack
                        p={1.2}
                        direction="column"
                        width={'fit-content'}
                        sx={{
                            backgroundColor: '#dcdcdc',
                            borderRadius: 1,
                            marginBottom: el.fileURL ? '-10px' : '-10px',
                        }}
                    >
                        {el.msgReply.msg_media_url && (
                            <Stack sx={{ opacity: 0.5 }}>
                                <img
                                    src={el.msgReply.msg_media_url}
                                    alt={el.msgReply.msg_content}
                                    style={{ maxHeight: 100, borderRadius: '10px' }}
                                />
                            </Stack>
                        )}
                        <Typography variant="body2" color="#737373">
                            {el.msgReply.msg_content}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="column"
                        p={1.4}
                        sx={{
                            background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                            borderRadius: 1.5, //1.5*8=12px
                        }}
                        position={'relative'}
                        width={'fit-content'}
                    >
                        {el.fileURL && (
                            <Stack>
                                <img
                                    src={el.fileURL}
                                    alt={el.message}
                                    style={{ maxHeight: 210, borderRadius: '10px' }}
                                />
                            </Stack>
                        )}
                        <Stack>
                            <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                                {el.message}
                            </Typography>
                        </Stack>

                        <Stack
                            direction={'row'}
                            alignContent="center"
                            justifyContent="center"
                            sx={{
                                position: 'absolute',
                                bottom: -1,
                                right: 4,
                                fontSize: '15px',
                            }}
                        >
                            {el.reactions?.map((reaction, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: '9px',
                                        height: '9px',
                                        borderRadius: '50%',
                                        marginRight: '6px',
                                    }}
                                >
                                    <em-emoji id={reaction}></em-emoji>
                                </div>
                            ))}
                        </Stack>
                    </Stack>
                </Box>
                <Stack justifyContent={'center'}>{el.incoming && showResponse && <Response el={el} />}</Stack>
            </Stack>
        </Stack>
    );
};

const MediaMsg = ({ el }) => {
    const theme = useTheme();
    const [showResponse, setShowResponse] = useState(false);

    return (
        <Stack
            direction="column" // Change direction to column to stack elements vertically
            alignItems={el.incoming ? 'flex-start' : 'flex-end'} // Align items based on message direction
            onMouseEnter={() => setShowResponse(true)}
            onMouseLeave={() => setShowResponse(false)}
            position={'relative'}
        >
            {/* Display username */}
            {el.incoming && (
                <Typography fontSize={12} marginLeft={0.5} color="#737373">
                    {el.user_name}
                </Typography>
            )}
            <Stack
                direction="row"
                justifyContent={el.incoming ? 'start' : 'end'}
                onMouseEnter={() => setShowResponse(true)}
                onMouseLeave={() => setShowResponse(false)}
            >
                {el.incoming || (showResponse && <Response el={el} />)}

                <Box
                    p={1}
                    sx={{
                        background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                        borderRadius: 1.5, //1.5*8=12px
                        width: 'max-content',
                        position: 'relative',
                    }}
                >
                    <Stack spacing={1}>
                        <img src={el.fileURL} alt={el.message} style={{ maxHeight: 210, borderRadius: '10px' }} />
                        <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                            {el.message}
                        </Typography>
                    </Stack>
                    <Stack
                        direction={'row'}
                        alignContent="center"
                        justifyContent="center"
                        sx={{
                            position: 'absolute',
                            bottom: -1,
                            right: 4,
                            fontSize: '15px',
                        }}
                    >
                        {el.reactions?.map((reaction) => (
                            <div
                                key={reaction} // Make sure to add a unique key when rendering a list of elements
                                style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    marginRight: '6px', // Add spacing between emoji icons if needed
                                }}
                            >
                                <em-emoji id={reaction}></em-emoji>
                            </div>
                        ))}
                    </Stack>
                </Box>
                {el.incoming && showResponse && <Response el={el} />}
            </Stack>
        </Stack>
    );
};
const TextMsg = ({ el }) => {
    const theme = useTheme();
    const [showResponse, setShowResponse] = useState(false);

    return (
        <Stack
            direction="column" // Change direction to column to stack elements vertically
            alignItems={el.incoming ? 'flex-start' : 'flex-end'} // Align items based on message direction
            onMouseEnter={() => setShowResponse(true)}
            onMouseLeave={() => setShowResponse(false)}
            position={'relative'}
        >
            {/* Display username */}
            {el.incoming && (
                <Typography fontSize={12} marginLeft={0.5} color="#737373">
                    {el.user_name}
                </Typography>
            )}

            <Stack direction="row" justifyContent={el.incoming ? 'flex-start' : 'flex-end'} position={'relative'}>
                {el.incoming || (showResponse && <Response el={el} />)}

                <Box
                    p={1.5}
                    sx={{
                        background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                        borderRadius: 1.5, //1.5*8=12px
                        maxWidth: '100%',
                        position: 'relative', // Ensure the box is positioned relative
                    }}
                >
                    <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.message}
                    </Typography>
                    {/* Position the emoji relative to the box */}
                    <Stack
                        direction={'row'}
                        alignContent="center"
                        justifyContent="center"
                        sx={{
                            position: 'absolute',
                            bottom: -1,
                            right: 4,
                            fontSize: '15px',
                        }}
                    >
                        {el.reactions?.map((reaction) => (
                            <div
                                key={reaction} // Make sure to add a unique key when rendering a list of elements
                                style={{
                                    width: '9px',
                                    height: '9px',
                                    borderRadius: '50%',
                                    marginRight: '6px', // Add spacing between emoji icons if needed
                                }}
                            >
                                <em-emoji id={reaction}></em-emoji>
                            </div>
                        ))}
                    </Stack>
                </Box>

                {el.incoming && showResponse && <Response el={el} />}
            </Stack>
        </Stack>
    );
};

const Timeline = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Divider width="46%" />
            <Typography variant="caption" sx={{ color: theme.palette.text }}>
                {el.timestamp}
            </Typography>
            <Divider width="46%" />
        </Stack>
    );
};

const MessageOptions = ({ el }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const anchorOrigin = el.incoming
        ? { horizontal: 'right', vertical: 'bottom' }
        : { horizontal: 'left', vertical: 'bottom' };
    const transformOrigin = el.incoming
        ? { horizontal: 'left', vertical: 'top' }
        : { horizontal: 'right', vertical: 'top' };

    return (
        <IconButton size="small">
            <DotsThreeVertical
                opacity={0.7}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size={20}
                style={{ cursor: 'pointer' }}
            />
            <Menu
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Stack spacing={1} px={1}>
                    {Message_options.map((e, index) => (
                        <MenuItem key={index}>{e.title}</MenuItem>
                    ))}
                </Stack>
            </Menu>
        </IconButton>
    );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
