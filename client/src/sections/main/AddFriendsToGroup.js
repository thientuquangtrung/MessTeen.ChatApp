import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFTextField } from '../../components/hook-form';
import RHFAutocomplete from '../../components/hook-form/RHFAutocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket';
import { showSnackbar } from '../../redux/app/appActionCreators';

const MEMBERS = ['Name 1', 'Name 2', 'Name 3', 'Name 4'];

// TODO => Create a reusable component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddFriendToGroupForm = ({ handleClose }) => {
    const { friends } = useSelector((state) => state.app);
    const { current_conversation } = useSelector((state) => state.conversation);
    const dispatch = useDispatch();

    const NewGroupSchema = Yup.object().shape({
        members: Yup.array().min(1, 'Add at least 1 friend to the group'),
    });

    const defaultValues = {
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

            socket.emit('add_member_to_group', {
                to: member_ids,
                from: user_id,
                conversation_id: current_conversation.id,
            });
        } catch (error) {
            console.log('error', error);
        }
        handleClose();
    };

    const options = useMemo(
        () =>
            friends
                .filter((friend) => !current_conversation.participant_ids.includes(friend._id))
                .map((option) => ({ id: option._id, label: option.usr_name })),
        [friends, current_conversation],
    );
    const filteredOptions = options.filter(
        (option) =>
            !getValues('members')
                .map((v) => v.id)
                .includes(option.id),
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFAutocomplete
                    name="members"
                    label="Members"
                    multiple
                    freeSolo
                    options={filteredOptions}
                    ChipProps={{ size: 'medium' }}
                />
                <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'end'}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Add Member
                    </Button>
                </Stack>
            </Stack>
        </FormProvider>
    );
};

const AddFriendToGroup = ({ open, handleClose }) => {
    return (
        <Dialog fullWidth maxWidth="xs" open={open} TransitionComponent={Transition} keepMounted sx={{ p: 4 }}>
            {/* Title */}
            <DialogTitle sx={{ mb: 3 }}>Add Member</DialogTitle>
            {/* Content */}
            <DialogContent>
                {/* Form */}
                <AddFriendToGroupForm handleClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendToGroup;
