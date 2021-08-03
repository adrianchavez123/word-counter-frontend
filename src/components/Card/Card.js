import React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Title from "../Title/Title";

export default function Card() {
  return (
    <React.Fragment>
      <Title>Crear nueva tarea</Title>
      <Button variant="contained" color="primary">
        Crear
      </Button>
      <div style={{ marginTop: "1rem" }}>
        <Link href="#" onClick={null}>
          Create un nuevo grupo
        </Link>
      </div>
    </React.Fragment>
  );
}
