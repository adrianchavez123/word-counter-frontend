import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Title from "../Title";
import useStyles from "../../Hooks/useStyles/useStyles";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage(
        "Por favor revisa tu correo electrónico para actualizar tu contraseña."
      );
    } catch (e) {
      setError("fallo restablecer tu contraseña, vuelve a intentar");
    }
    setLoading(false);
  };
  return (
    <div className={classes.authContainer}>
      <Card className={classes.authRoot} variant="outlined">
        <CardContent>
          <Title>Restablecer contraseña</Title>
          {error && <span className={classes.failureText}>{error}</span>}
          {message && <span className={classes.sucessText}>{message}</span>}

          <form onSubmit={handleSubmit}>
            <FormGroup className={classes.formGroup}>
              <TextField
                id="email"
                label="Correo Electrónico"
                type="email"
                inputRef={emailRef}
                required
              />
            </FormGroup>
            <div style={{ paddingTop: "1rem" }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                type="submit"
              >
                Restablecer contraseña
              </Button>
            </div>
            {loading && (
              <div className={classes.loadingContainer}>
                {" "}
                <CircularProgress />
              </div>
            )}
          </form>
        </CardContent>

        <CardActions>
          Ya cuentas con una cuenta? <Link to="/login">Iniciar sesión</Link>
        </CardActions>
      </Card>
    </div>
  );
}
