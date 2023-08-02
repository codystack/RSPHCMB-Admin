import React from "react";
import Typography from "@mui/material/Typography";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const TimeAgo = (props) => {
  const [text, setText] = React.useState("");
  //handleTime(props.dateString);

  React.useEffect(() => {
    handleTime(props.dateString);
    setInterval(() => {
      handleTime(props.dateString);
    }, 60000);
  });

  function handleTime(dateString) {
    var finalResult;
    var result = formatDistanceToNow(new Date(dateString));

    if (result === "less than a minute") {
      finalResult = "Just now";
    } else if (result.indexOf("about") !== -1) {
      finalResult = result.replace("about", "") + " ago";
    } else if (result.indexOf("over") !== -1) {
      finalResult = result.replace("over", "") + " ago";
    } else if (result.indexOf("almost") !== -1) {
      finalResult = result.replace("almost", "") + " ago";
    } else {
      finalResult = result + " ago";
    }

    if (result.indexOf("minutes") !== -1) {
      finalResult = result.replace("minutes", "mins") + " ago";
    }
    if (result.indexOf("minute") !== -1) {
      finalResult = result.replace("minute", "min") + " ago";
    }

    setText(finalResult);
  }

  return <Typography variant={props.variant}>{text}</Typography>;
};

export default TimeAgo;
