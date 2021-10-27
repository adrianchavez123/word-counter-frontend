import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    background: "#3f51b5",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  formGroup: {
    margin: "1rem 0",
  },
  textFullWidth: {
    width: "95%",
  },
  review: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "1fr 1fr 1fr",
    height: "200px",
  },
  studentForm: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "80% 20%",
  },
  addStudent: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "40% 40% 20%",
  },
  addStudentField: {
    display: "flex",
    flexDirection: "column",
    margin: "0 0.3rem",
  },
  authRoot: {
    minWidth: 600,
    padding: "2rem 0.5rem",
  },
  failureText: {
    fontSize: "0.8rem",
    color: "#f44336",
  },
  sucessText: {
    fontSize: "0.8rem",
    color: "rgb(30, 70, 32)",
  },
  loadingContainer: {
    display: "grid",
    justifyContent: "center",
    alignContent: "center",
  },
  authContainer: {
    background: "#f4f4f4",
    display: "grid",
    justifyContent: "center",
    alignContent: "center",
    width: "100vw",
    height: "100vh",
  },
}));

export default useStyles;
