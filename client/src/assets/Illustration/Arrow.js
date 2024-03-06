import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function Arrow({ ...other }) {
    const theme = useTheme();

    const PRIMARY_MAIN = theme.palette.primary.main;

    return (
        <Box {...other}>
            <svg width="257" height="73" viewBox="0 0 257 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 30.4C21.2075 12.5926 44.6418 -1.25821 71.4445 4.44442C91.3502 8.67964 76.9349 34.5156 75.3556 46.7556C69.3481 93.3137 195.603 56.1262 214.111 48.8C217.513 47.4533 248.151 32.7085 246.911 32C243.931 30.2972 224.901 27.2 230.2 27.2C238.029 27.2 245.436 30.4 253.4 30.4C257.358 30.4 239.758 56.6452 238.2 60.8"
                    stroke={PRIMARY_MAIN}
                    stroke-width="5"
                    stroke-linecap="round"
                />
            </svg>
        </Box>
    );
}

export default memo(Arrow);
