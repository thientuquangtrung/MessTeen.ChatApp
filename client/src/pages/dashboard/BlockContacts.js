import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Divider, Grid, IconButton, InputBase, Modal, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { CaretLeft, MagnifyingGlass, Plus, X } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { ChatList } from '../../data';

const BlockElements = ({ id, name, img, msg, time }) => {
    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: 1,
                // height: 60,
                backgroundColor: '#fff',
            }}
            p={2}
        >
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} spacing={2}>
                    <Avatar src={faker.image.avatar()} />

                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Typography variant="caption">{msg}</Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={'center'}>
                    <IconButton>
                        <X size={12} color="#4b4b4b" />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#EAF2FE',
    marginLeft: 0,
    width: '100%',
    marginRight: theme.spacing(2),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

const BlockContacts = () => {
    const navigate = useNavigate();

    const handleBackBlockContacts = () => {
        navigate('/settings/privacy');
    };

    const [openModal, setOpenModal] = React.useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const theme = useTheme();

    return (
        <>
            <Stack direction={'row'} sx={{ width: '100%' }}>
                {/* LeftPanel */}
                <Box
                    sx={{
                        // overflow: "scroll",
                        height: '100vh',
                        width: 320,
                        backgroundColor: theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background,
                        boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
                    }}
                >
                    <Stack p={4} spacing={2.5}>
                        {/* Header */}
                        <Stack direction={'row'} alignItems={'center'} spacing={3}>
                            <IconButton onClick={handleBackBlockContacts}>
                                <CaretLeft size={24} color="#4b4b4b" />
                            </IconButton>
                            <Typography variant="h5" fontWeight={'900'}>
                                Block Contacts
                            </Typography>
                        </Stack>

                        <Stack>
                            <Grid container direction={'row'} alignItems="center">
                                <Grid item xs={12} sm={9}>
                                    <Stack spacing={1}>
                                        <Typography sx={{ color: '#709CE6', fontWeight: '800' }} variant="body1">
                                            Block New Contact
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={3} style={{ textAlign: 'right' }}>
                                    <IconButton onClick={handleOpenModal}>
                                        <Plus size={20} color="#709CE6" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider />
                        </Stack>

                        <Stack
                            sx={{
                                overflow: 'auto',
                                maxHeight: 'calc(100vh - 12rem )',
                                paddingRight: 1,
                            }}
                        >
                            <Stack spacing={2.4} direction={'column'}>
                                {ChatList.filter((el) => !el.pinned).map((el) => {
                                    return <BlockElements {...el} />;
                                })}
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Modal open={openModal} onClose={handleCloseModal}>
                            <Stack
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 450,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 3,
                                    borderRadius: '20px',
                                    // overflow: "scroll",
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" alignItems="center">
                                        <IconButton onClick={handleCloseModal}>
                                            <X size={24} color="#4b4b4b" />
                                        </IconButton>
                                        <Typography
                                            variant="h4"
                                            fontWeight={800}
                                            sx={{ flexGrow: 1, textAlign: 'center', mr: 3 }}
                                        >
                                            Block New Contact
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack sx={{}}>
                                        <Search>
                                            <SearchIconWrapper>
                                                <MagnifyingGlass color="#709CE6" />
                                            </SearchIconWrapper>
                                            <StyledInputBase
                                                placeholder="Search"
                                                inputProps={{ 'aria-label': 'search' }}
                                            />
                                        </Search>
                                        <Stack
                                            spacing={1}
                                            sx={{
                                                '.MuiIconButton-root': {
                                                    display: 'none',
                                                },
                                                paddingTop: 1,
                                                maxHeight: '70vh',
                                                overflow: 'auto',
                                                overflowX: 'hidden',
                                            }}
                                        >
                                            {ChatList.filter((el) => !el.pinned).map((el) => (
                                                <Box sx={{ cursor: 'pointer' }}>
                                                    <BlockElements key={el.id} {...el} />
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Modal>
                    </Stack>
                </Box>
            </Stack>
        </>
    );
};

export default BlockContacts;
