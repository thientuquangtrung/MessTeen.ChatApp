import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFTextField } from '../../components/hook-form';
import RHFAutocomplete from '../../components/hook-form/RHFAutocomplete';
import { useSelector } from 'react-redux';
import { socket } from '../../socket';

const MEMBERS = ['Name 1', 'Name 2', 'Name 3', 'Name 4'];

// TODO => Create a reusable component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose }) => {
    const { friends } = useSelector((state) => state.app);
    console.log(friends);

    const NewGroupSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        members: Yup.array().min(2, 'Must have at least 3 members including yourself'),
    });

    const defaultValues = {
        title: '',
        members: [],
    };

    const methods = useForm({
        resolver: yupResolver(NewGroupSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
    } = methods;

    const onSubmit = async (data) => {
        try {
            //API call
            console.log('DATA', data);
            const member_ids = data.members.map((member) => member.id);
            const user_id = window.localStorage.getItem('user_id');
            const title = data.title;

            socket.emit('group_conversation', { to: member_ids, from: user_id, title });
        } catch (error) {
            console.log('error', error);
        }
        handleClose();
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="title" label="Title" />
                <RHFAutocomplete
                    name="members"
                    label="Members"
                    multiple
                    freeSolo
                    options={friends.map((option) => ({ id: option._id, label: option.usr_name }))}
                    ChipProps={{ size: 'medium' }}
                />
                <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'end'}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained" >
                        Create
                    </Button>
                </Stack>
            </Stack>
        </FormProvider>
    );
};

const CreateGroup = ({ open, handleClose }) => {
    return (
        <Dialog fullWidth maxWidth="xs" open={open} TransitionComponent={Transition} keepMounted sx={{ p: 4 }}>
            {/* Title */}
            <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>
            {/* Content */}
            <DialogContent>
                {/* Form */}
                <CreateGroupForm handleClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroup;
