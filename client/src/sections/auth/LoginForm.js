import { useState } from "react";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { LoginUser } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";

const LoginForm = () => {
    //#region fields
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { isLoading } = useSelector((state) => state.auth);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required("Email is required").email("Email must be a valid email address"),
        password: Yup.string().required("Password is required"),
    });

    const defaultValues = {
        email: "trung_test@gmail.com",
        password: "1234567890",
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = methods;
    //#endregion fields

    //#region methods
    const onSubmit = async (data) => {
        try {
            const params = createRequest(data);
            console.log(params);
            // submit params to backend
            dispatch(LoginUser(params));
        } catch (error) {
            console.log(error);
            reset();
            setError("afterSubmit", {
                ...error,
                message: error.message,
            });
        }
    };

    const createRequest = (data) => {
        return {
            usr_email: data.email,
            usr_password: data.password,
        };
    };
    //#endregion methods

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                <RHFTextField name="email" label="Email address" />

                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
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
            </Stack>
            <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
                <Link component={RouterLink} to="/auth/reset-password" variant="body2" color="inherit" underline="always">
                    Forgot Password?
                </Link>
            </Stack>
            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
                sx={{
                    bgcolor: "text.primary",
                    color: (theme) => (theme.palette.mode === "light" ? "common.white" : "grey.800"),
                    "&:hover": {
                        bgcolor: "text.primary",
                        color: (theme) => (theme.palette.mode === "light" ? "common.white" : "grey.800"),
                    },
                }}
            >
                Login
            </LoadingButton>
        </FormProvider>
    );
};

export default LoginForm;
