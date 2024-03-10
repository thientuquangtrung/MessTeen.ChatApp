// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import { useDispatch, useSelector } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { closeSnackBar } from './redux/app/appActionCreators';
import { forwardRef } from 'react';
// import Alert from "./theme/overrides/Alert";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './pages/ErrorFallback';

const vertical = 'bottom';
const horizontal = 'center';

const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function App() {
    const dispatch = useDispatch();

    const { severity, message, open } = useSelector((state) => state.app.snackbar);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeProvider>
                <ThemeSettings>
                    {' '}
                    <Router />{' '}
                </ThemeSettings>
            </ThemeProvider>

            {message && open ? (
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    autoHideDuration={4000}
                    key={vertical + horizontal}
                    onClose={() => {
                        dispatch(closeSnackBar());
                    }}
                >
                    <Alert
                        onClose={() => {
                            dispatch(closeSnackBar());
                        }}
                        severity={severity}
                        sx={{ width: '100%' }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            ) : (
                <></>
            )}
        </ErrorBoundary>
    );
}

export default App;
