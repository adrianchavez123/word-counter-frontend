import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Calificación de estudiantes{"  "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}