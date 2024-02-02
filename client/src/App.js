// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings";
import { useDispatch, useSelector } from "react-redux";
import { Alert as MuiAlert, Snackbar } from "@mui/material";
import { closeSnackBar } from "./redux/app/appActionCreators";
import { forwardRef } from "react";
// import Alert from "./theme/overrides/Alert";

const vertical = "bottom";
const horizontal = "center";

const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function App() {
    const dispatch = useDispatch();

    const { severity, message, open } = useSelector((state) => state.app.snackbar);

    return (
        <>
            <ThemeProvider>
                <ThemeSettings>
                    {" "}
                    <Router />{" "}
                </ThemeSettings>
            </ThemeProvider>

            {message && open ? (
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    autoHideDuration={4000}
                    key={vertical + horizontal}
                    onClose={() => {
                        console.log("This is clicked");
                        dispatch(closeSnackBar());
                    }}
                >
                    <Alert
                        onClose={() => {
                            console.log("This is clicked");
                            dispatch(closeSnackBar());
                        }}
                        severity={severity}
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            ) : (
                <></>
            )}
        </>
    );
}

export default App;
