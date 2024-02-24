import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import { faker } from '@faker-js/faker';
import { styled, useTheme } from '@mui/material/styles';
import { SelectConversation } from '../redux/app/appActionCreators';
import { useDispatch } from 'react-redux';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    return (
        <Box
            onClick={() => {
                dispatch(SelectConversation({ room_id: id }));
            }}
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: theme.palette.mode === 'light' ? 'F8FAFF' : theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} spacing={2}>
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar src={faker.image.avatar()} />
                        </StyledBadge>
                    ) : (
                        <Avatar src={faker.image.avatar()} />
                    )}

                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Typography variant="caption">{msg}</Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={'center'}>
                    <Typography sx={{ fontWeight: '600' }} variant="caption">
                        9:36
                    </Typography>
                    <Badge color="primary" badgeContent={unread}></Badge>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ChatElement;
