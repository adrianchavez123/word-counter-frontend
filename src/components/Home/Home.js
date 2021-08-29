import React, { useEffect, useReducer } from "react";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chart from "../Chart";
import Deposits from "../Card/";
import Table from "../../Table";
import useStyles from "../../Hooks/useStyles/useStyles";
import actions from "./home-actions";
import reducer from "./home-reducer";
import initialize from "./home-initialize";
import convertISOToYMD from "../../utils/dateUtils";

const headers = [
  "Tarea",
  "Fecha de Entrega Máxima",
  "Cantidad de Tareas Recibidas",
];
export default function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [state, dispatch] = useReducer(reducer, initialize);
  useEffect(() => {
    const professor_id = 1;
    fetch(
      `http://localhost:5000/api/deliver-assignments/last-delivers?professor_id=${professor_id}`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          const delivers = data.map((data) => [
            data.assignment_id,
            data.title,
            convertISOToYMD(data.due_date),
            data.total_delivers,
          ]);
          dispatch({
            type: actions.getLastDelivers,
            payload: {
              lastDelivers: delivers.filter((deliver, i) => i < 10),
            },
          });
          dispatch({
            type: actions.getDelivers,
            payload: {
              delivers: delivers,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">Inicio</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Deposits />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Table
            title="Ultimas Tareas"
            headers={headers}
            showActions={false}
            rows={state.lastDelivers}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
