import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import ActionButton from "../../button/action_button";
// import TimeAgo from "../countdown/timeago";
// import ActionButton3 from "../../button/action_button3";
import ActionButton4 from "../../button/action_button4";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function EnquiriesTable(props) {
  let { list } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S/N0</StyledTableCell>
            <StyledTableCell align="right">FULLNAME</StyledTableCell>
            <StyledTableCell align="left">DATE</StyledTableCell>
            <StyledTableCell align="left">EMAIL ADDRESS</StyledTableCell>
            <StyledTableCell align="left">PHONE </StyledTableCell>
            <StyledTableCell align="left">SUBJECT</StyledTableCell>
            <StyledTableCell align="left">REQUEST</StyledTableCell>
            <StyledTableCell align="left">ACTION</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell align="inherit">{row?.fullname}</StyledTableCell>
              <StyledTableCell align="inherit">
                {new Date(row?.createdAt.seconds * 1000).toLocaleDateString(
                  "en"
                )}
              </StyledTableCell>
              <StyledTableCell align="inherit">{row?.email}</StyledTableCell>
              <StyledTableCell align="left">{row?.phone}</StyledTableCell>
              <StyledTableCell align="inherit">{row?.subject}</StyledTableCell>
              <StyledTableCell align="inherit">
                {row?.request?.length > 36
                  ? row?.request?.substring(0, 32) + "..."
                  : row?.request}
              </StyledTableCell>
              <StyledTableCell align="right">
                <ActionButton4 selected={row} index={index} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
