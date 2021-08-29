import React, { useEffect, useReducer } from "react";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Chart from "../Chart";
import Card from "../Card/";
import Table from "../../Table";
import useStyles from "../../Hooks/useStyles/useStyles";
import { homeActions, homeInitialize, homeReducer } from ".";
import convertISOToYMD from "../../utils/dateUtils";

const headers = [
  "Tarea",
  "Fecha de Entrega Máxima",
  "Cantidad de Tareas Recibidas",
];
export default function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [state, dispatch] = useReducer(homeReducer, homeInitialize);
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
            type: homeActions.getLastDelivers,
            payload: {
              lastDelivers: delivers.filter((deliver, i) => i < 10),
            },
          });
          dispatch({
            type: homeActions.getDelivers,
            payload: {
              delivers: delivers,
            },
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const professor_id = 1;
    fetch(
      `http://localhost:5000/api/deliver-assignments/average-delivers?professor_id=${professor_id}`,
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
          const averageDeliverResults = data.map((data) => ({
            name: data.title,
            cantidad_palabras_detectadas: data.avg_words_amount,
            cantidad_palabras_en_lectura: data.words_amount,
          }));

          dispatch({
            type: homeActions.getAverageDeliverResults,
            payload: {
              averageDeliverResults: averageDeliverResults,
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
          <Chart rows={state.averageDeliverResults} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <Card />
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
