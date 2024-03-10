import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React, { useMemo } from 'react';
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
        getValues,
        handleSubmit,
        formState: { isValid },
    } = methods;

    const onSubmit = async (data) => {
        try {
            //API call
            const member_ids = data.members.map((member) => member.id);
            const user_id = window.localStorage.getItem('user_id');
            const title = data.title;

            socket.emit('group_conversation', { to: member_ids, from: user_id, title });
        } catch (error) {
            console.log('error', error);
        }
        handleClose();
    };

    const options = useMemo(() => friends.map((option) => ({ id: option._id, label: option.usr_name })), [friends]);
    const filteredOptions = options.filter(
        (option) =>
            !getValues('members')
                .map((v) => v.id)
                .includes(option.id),
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="title" label="Title" />
                <RHFAutocomplete
                    name="members"
                    label="Members"
                    multiple
                    freeSolo
                    options={filteredOptions}
                    filterSelectedOptions
                    ChipProps={{ size: 'medium' }}
                />
                <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'end'}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
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
