import React from "react";
import { useTheme, styled } from "@mui/material/styles";
import {
    Box,
    Badge,
    Avatar,
    Button,
    Typography,
    Stack,
    IconButton,
} from "@mui/material";
import { Chat } from "phosphor-react";
import { faker } from "@faker-js/faker";

const StyledChatBox = styled(Box)(({ theme }) => ({
    "&:hover": {
        cursor: "pointer",
    },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
}));

const UserComponent = ({ firstName, lastName, _id, online, img }) => {
    const user_id = window.localStorage.getItem("user_id");
    const theme = useTheme();
    // const name = `${firstName} ${lastName}`;
    const name = "Ngan Tran";

    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    {/* {" "} */}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={faker.image.avatar()} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={faker.image.avatar()} />
                    )}
                    
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Button
                    // onClick={() => {
                    //     socket.emit(
                    //         "friend_request",
                    //         { to: _id, from: user_id },
                    //         () => {
                    //             alert("request sent");
                    //         }
                    //     );
                    // }}
                    >
                        Send Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendRequestComponent = ({
    firstName,
    lastName,
    _id,
    online,
    img,
    id,
}) => {
    const theme = useTheme();
    // const name = `${firstName} ${lastName}`;
    const name = "Ngan Tran";
    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={faker.image.avatar()} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={img} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Button
                    // onClick={() => {
                    //     socket.emit(
                    //         "accept_request",
                    //         { request_id: id },
                    //         () => {
                    //             alert("request sent");
                    //         }
                    //     );
                    // }}
                    >
                        Accept Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendComponent = ({ img, firstName, lastName, online, _id }) => {
    const theme = useTheme();

    const name = `${firstName} ${lastName}`;

    return (
        <StyledChatBox
            sx={{
                width: "100%",

                borderRadius: 1,

                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
            >
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    {" "}
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={faker.image.avatar()} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={name} src={faker.image.avatar()} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                    </Stack>
                </Stack>
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <IconButton
                    // start a new conversation
                    >
                        <Chat />
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

export { UserComponent, FriendRequestComponent, FriendComponent };
