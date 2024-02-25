import React, { useState } from 'react';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../../redux/auth/authActionCreators';
import { LoadingButton } from '@mui/lab';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required('Your name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        password: Yup.string().required('Password is required').min(8),
    });

    const defaultValues = {
        name: '',
        email: '',
        password: '',
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = methods;

    const onSubmit = async (data) => {
        try {
            // Submit data to backend
            const params = createRequest(data);
            dispatch(RegisterUser(params));
        } catch (error) {
            console.log(error);
            reset();
            setError('afterSubmit', {
                ...error,
                message: error.message,
            });
        }
    };

    const createRequest = (data) => {
        return {
            usr_name: data.name,
            usr_email: data.email,
            usr_password: data.password,
        };
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                <RHFTextField name="name" label="Full name" />
                <RHFTextField name="email" label="Email address" />

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                <IconButton
                                    onClick={() => {
                                        setShowPassword(!showPassword);
                                    }}
                                >
                                    {showPassword ? <Eye /> : <EyeSlash />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <LoadingButton
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isLoading}
                    sx={{
                        bgcolor: 'text.primary',
                        color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                        '&:hover': {
                            bgcolor: 'text.primary',
                            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                        },
                    }}
                >
                    Create Account
                </LoadingButton>
            </Stack>
        </FormProvider>
    );
};

export default RegisterForm;
