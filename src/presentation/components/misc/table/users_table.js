import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ActionButton from "../../button/action_button";

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

export default function UsersTable(props) {
  let { list } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S/N0</StyledTableCell>
            <StyledTableCell align="left">FIRST NAME</StyledTableCell>
            <StyledTableCell align="left">LAST NAME</StyledTableCell>
            <StyledTableCell align="left">EMAIL ADDRESS</StyledTableCell>
            <StyledTableCell align="left">PHONE NUMBER</StyledTableCell>
            <StyledTableCell align="left">ROLE</StyledTableCell>
            <StyledTableCell align="left">ACTIONS</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell align="inherit">
                {row?.firstname}
              </StyledTableCell>
              <StyledTableCell align="inherit">{row?.lastname}</StyledTableCell>
              <StyledTableCell align="inherit">{row?.email}</StyledTableCell>
              <StyledTableCell align="inherit">{row?.phone}</StyledTableCell>
              <StyledTableCell align="inherit">{row?.role}</StyledTableCell>
              <StyledTableCell align="right">
                <ActionButton selected={row} index={index} />
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
