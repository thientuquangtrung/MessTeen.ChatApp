import { useTheme } from '@emotion/react';
import { Box, Divider, IconButton, Link, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { DotsThreeVertical, DownloadSimple, Image } from 'phosphor-react';
import { element } from 'prop-types';

import React from 'react';
import { Message_options } from '../../data';
const DocMsg = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
            {el.incoming || <MessageOptions el={el} />}
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
            {el.incoming && <MessageOptions el={el} />}
        </Stack>
    );
};
const LinkMsg = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
            {el.incoming || <MessageOptions el={el} />}
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
            {el.incoming && <MessageOptions el={el} />}
        </Stack>
    );
};

const ReplyMsg = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
            {el.incoming || <MessageOptions el={el} />}
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
                        direction="column"
                        spacing={3}
                        alignItems="center"
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body2" color={theme.palette.text}>
                            {el.message}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.reply}
                    </Typography>
                </Stack>
            </Box>
            {el.incoming && <MessageOptions el={el} />}
        </Stack>
    );
};
const MediaMsg = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
            {el.incoming || <MessageOptions el={el} />}
            <Box
                p={1.5}
                sx={{
                    background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                    borderRadius: 1.5, //1.5*8=12px
                    width: 'max-content',
                }}
            >
                <Stack spacing={1}>
                    <img src={el.img} alt={el.message} style={{ maxHeight: 210, borderRadius: '10px' }} />
                    <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                        {el.message}
                    </Typography>
                </Stack>
            </Box>
            {el.incoming && <MessageOptions el={el} />}
        </Stack>
    );
};
const TextMsg = ({ el }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" justifyContent={el.incoming ? 'start' : 'end'}>
            {el.incoming || <MessageOptions el={el} />}

            <Box
                p={1.5}
                sx={{
                    background: el.incoming ? theme.palette.background.default : theme.palette.primary.main,
                    borderRadius: 1.5, //1.5*8=12px
                    width: 'max-content',
                }}
            >
                <Typography variant="body2" color={el.incoming ? theme.palette.text : '#fff'}>
                    {el.message}
                </Typography>
            </Box>
            {el.incoming && <MessageOptions el={el} />}
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
        <>
            <DotsThreeVertical
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
        </>
    );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
