import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "../Nav";
import { Home } from "../Home";
import Students from "../Students";
import Exercises from "../Exercises";
import { Assignments } from "../Assignments";
import DeliverReview from "../DeliverReview";
import Footer from "../Footer";
import useStyles from "../../Hooks/useStyles/useStyles";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const displayName = currentUser.displayName;
  const email = currentUser.email;
  const photoURL = currentUser.photoURL;
  const emailVerified = currentUser.emailVerified;
  const uid = currentUser.uid;

  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  async function handleLogout() {
    setError("");
    try {
      await logout();
    } catch {
      setError("failed to log out");
      history.push("/login");
    }
  }

  useEffect(() => {
    const fetchProfessor = async () => {
      const professor_id = currentUser.uid;
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/professors/${professor_id}`
      );

      const json = await response.json();
      if (json?.message === "Professor not found!") {
        const professor = {
          professor_id: currentUser.uid,
          username: currentUser.displayName,
          name: currentUser.displayName,
          email: currentUser.email,
        };
        const respose = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVICE_URL}/api/professors`,
          {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(professor),
          }
        );
        await respose.json();
      }
    };
    fetchProfessor();
  }, [currentUser.uid, currentUser.displayName, currentUser.email]);

  const dash = () => {
    return (
      <>
        <div className="body">
          <h2>profile</h2>
          {error && <span>{error}</span>}
          <strong>Email: </strong>
          {currentUser.email}
          <Link to="/update-profile">Update profile</Link>
        </div>
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </>
    );
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Calificaciones de los estudiantes
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Switch>
            <Route path="/alumnos">
              <Grid container spacing={3}>
                <Students />
              </Grid>
            </Route>
            <Route path="/ejercicios">
              <Grid container spacing={3}>
                <Exercises />
              </Grid>
            </Route>
            <Route path="/tareas">
              <Assignments />
            </Route>
            <Route exact path="/">
              <Grid container spacing={3}>
                <Home />
              </Grid>
            </Route>
            <Route exact path="/resumen-tarea/:deliverAssignmentId">
              <Grid container spacing={3}>
                <DeliverReview />
              </Grid>
            </Route>
          </Switch>
          <Box pt={4}>
            <Footer />
          </Box>
        </Container>
      </main>
    </div>
  );
}
