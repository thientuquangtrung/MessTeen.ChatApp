import React from 'react';
import { Button, Typography, Box } from '@mui/material';

function ErrorFallback({ error }) {
    console.log(error.message);

    const redirectToHome = () => {
        window.location.href = '/app';
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <Typography variant="h4" align="center" gutterBottom>
                Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
                Don't worry, we're working on it. Please try again later.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={redirectToHome}
                size="large"
                sx={{ marginTop: '1rem' }}
            >
                Go to Homepage
            </Button>
        </Box>
    );
}

export default ErrorFallback;
