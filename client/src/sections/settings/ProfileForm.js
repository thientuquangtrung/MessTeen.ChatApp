import React, { useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
// form
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateUserProfile } from '../../redux/app/appActionCreators';

const ProfileForm = () => {
    const dispatch = useDispatch();
    const [file, setFile] = useState();
    const { user } = useSelector((state) => state.app);

    const ProfileSchema = Yup.object().shape({
        fullName: Yup.string().required('Name is required'),
        about: Yup.string().required('About is required'),
        avatar: Yup.string().required('Avatar is required').nullable(true),
    });

    const defaultValues = {
        fullName: user?.usr_name,
        about: user?.usr_bio,
        avatar: user?.usr_avatar,
    };

    const methods = useForm({
        resolver: yupResolver(ProfileSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isSubmitSuccessful, isDirty },
    } = methods;

    const values = watch();
    
    const onSubmit = async (data) => {
        try {
            //   Send API request
            dispatch(
                UpdateUserProfile({
                    fullName: data?.fullName,
                    about: data?.about,
                    avatar: file,
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            setFile(file);

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('avatar', newFile, { shouldValidate: true });
            }
        },
        [setValue],
    );

    // useEffect(() => {
    //     if (isSubmitSuccessful) {
    //         const timeout = setTimeout(() => {
    //             reset();
    //         }, 2000);

    //         return () => clearTimeout(timeout);
    //     }
    // }, [isSubmitSuccessful, reset]);

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />

                <RHFTextField helperText={'This name is visible to your contacts'} name="fullName" label="Full Name" />
                <RHFTextField multiline rows={4} name="about" label="About" />

                <Stack direction={'row'} justifyContent="end">
                    <LoadingButton
                        color="primary"
                        size="large"
                        type="submit"
                        variant="outlined"
                        // loading={isSubmitSuccessful || isSubmitting}
                        // disabled={!isDirty}
                    >
                        Save
                    </LoadingButton>
                </Stack>
            </Stack>
        </FormProvider>
    );
};

export default ProfileForm;
