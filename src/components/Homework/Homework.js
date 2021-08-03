import React from "react";
import TextField from "@material-ui/core/TextField";

export default function Homework() {
  return (
    <div>
      <form noValidate>
        <TextField id="standard-basic" label="Nombre" value="" />
        <TextField
          id="date"
          label="Fecha de entrega"
          type="date"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    </div>
  );
}
