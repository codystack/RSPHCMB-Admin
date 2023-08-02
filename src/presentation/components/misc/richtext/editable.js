import React from "react";
import MUIRichTextEditor from "mui-rte";
import {
  //   EditorState,
  convertToRaw,
} from "draft-js";
// import { createMuiTheme } from "@mui/core/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

Object.assign(defaultTheme, {
  overrides: {
    MUIRichTextEditor: {
      root: {
        marginBottom: 10,
        width: "100%",
      },
      container: {
        height: "100%",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: 6,
        padding: 15,
        overflow: "auto",
      },
      editorContainer: {
        position: "relative !important",
        marginBottom: 20,
        minHeight: 100,
        maxHeight: 156,
      },
    },
  },
});

const EditableRichText = (props) => {
  const { value, setValue, setError, error, setIsStartedFilling } = props;

  React.useEffect(() => {}, [setIsStartedFilling]);

  const handleChange = (state) => {
    const data = JSON.stringify(convertToRaw(state.getCurrentContent()));

    if (error) {
      setError(false);
    }

    if (state.getCurrentContent().hasText()) {
      setValue(data);
    }
  };

  const save = (data) => {
    console.log(data);
    setValue(data);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <MUIRichTextEditor
        controls={[
          "title",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "highlight",
          "undo",
          "redo",
          "link",
          "media",
          "numberList",
          "bulletList",
          "quote",
          "code",
          "clear",
          "save",
        ]}
        error={error}
        label="Type here..."
        toolbarButtonSize="small"
        inlineToolbar={true}
        onSave={save}
        onChange={handleChange}
        defaultValue={value}
      />
    </ThemeProvider>
  );
};

export default EditableRichText;
