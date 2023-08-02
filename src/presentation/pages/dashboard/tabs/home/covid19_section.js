import { ArrowBackIosNew } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";

const Covid19Section = () => {
  const history = useHistory();
  return (
    <div>
      <Container>
        <Button
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIosNew />}
        >
          Back
        </Button>
        <br />
        <br />
      </Container>
    </div>
  );
};

export default Covid19Section;
