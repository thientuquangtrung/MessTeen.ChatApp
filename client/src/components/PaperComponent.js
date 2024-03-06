import { Paper } from '@mui/material';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable bounds={'body'} allowAnyClick={false}>
            <Paper {...props} />
        </Draggable>
    );
}

export default PaperComponent;
