const theme = {
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#18113C",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#00B0EF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //   fontSize: "1rem",
          borderRadius: 1,
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: 1.4,
        },
      },
    },
  },
};
export default theme;
