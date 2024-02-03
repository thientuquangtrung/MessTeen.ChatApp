import {styled, alpha} from '@mui/material/styles'

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.paper, 1),
    marginLeft: 0,
    width: "100%",
    marginRight: theme.spacing(2),
  }));

export default Search;