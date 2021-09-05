import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch (e) {
      setError(
        "Fallo el inicio de sesión, por favor revisa que tu correo y contraseña sean correctos."
      );
    }
    setLoading(false);
  };
  return (
    <div className={classes.authContainer}>
      <Card className={classes.authRoot} variant="outlined">
        <CardContent>
          <Title>Inicial Sesión</Title>
          {error && <span className={classes.failureText}>{error}</span>}
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
            <FormGroup className={classes.formGroup}>
              <TextField
                id="password"
                label="contraseña"
                type="password"
                inputRef={passwordRef}
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
                Iniciar sesión
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
          <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
        </CardActions>
        <CardActions>
          Necesitas una cuenta? <Link to="/signup">Registrarte</Link>
        </CardActions>
      </Card>
    </div>
  );
}
