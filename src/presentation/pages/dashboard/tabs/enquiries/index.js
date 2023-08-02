import { Container, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import EnquiriesTable from "../../../../components/misc/table/enquiries_table";

const Enquiries = () => {
  const { enquiriesData } = useSelector((state) => state.enquiries);

  return (
    <div>
      <Container>
        <Typography variant="h6" gutterBottom>
          ENQUIRIES
        </Typography>
        <br />
        <EnquiriesTable list={enquiriesData} />
      </Container>
    </div>
  );
};

export default Enquiries;
