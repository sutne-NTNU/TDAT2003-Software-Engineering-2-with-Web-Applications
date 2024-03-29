import { Component } from "react-simplified";
import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavLink from "react-bootstrap/NavLink";
import { authService } from "../AuthService";
import { Card } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export class LoginForm extends Component {
  constructor(props) {
    super(props);

    if (authService.loggedIn()) {
      window.location = "/hjem";
    }

    this.state = {
      email: "",
      password: "",
      error: "",
      errorType: "success",
      loading: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  setError(message, variant) {
    this.setState({ error: message, errorType: variant });
    if (!message) {
      return;
    }
    setTimeout(() => this.setState({ error: "", errorType: "primary" }), 5000);
  }

  async handleLogin() {
    this.setError("", "primary");
    this.setState({ loading: true });

    if (!this.state.email || !this.state.password) {
      this.setState({ loading: false });
      this.setError("Alle felter må fylles.", "danger");
      return;
    }

    let result = await authService.login(this.state.email, this.state.password);

    if (authService.loggedIn()) {
      window.location = "/hjem";
    } else {
      this.setState({ loading: false });
      this.setError("Innlogging feilet", "danger");
    }
    this.setState({ loading: false });
  }

  render() {
    return (
      <Container className={"c-sm"} style={{ top: "0", paddingBottom: "5em" }}>
        <h1 className="HarmoniLogo display-sm-3 text-center m-5">Harmoni</h1>

        <Card className="login m-sm-5 mw-25">
          <div style={{ padding: "5%" }}>
            <h1 className="h1 text-center">Logg inn</h1>

            {this.state.error ? (
              <Alert style={{ height: "3em" }} variant={this.state.errorType}>
                {this.state.error}
              </Alert>
            ) : (
              <div style={{ height: "3em" }} />
            )}

            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Skriv inn email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Passord</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Skriv inn passord"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                />
              </Form.Group>

              <Button
                className="mr-2"
                onClick={this.handleLogin}
                variant="primary"
                type="button"
              >
                {this.state.loading ? (
                  <Spinner
                    className="mr-2"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <div />
                )}
                Login
              </Button>
              <Button href="/" variant="secondary" type="button">
                Avbryt
              </Button>
              <NavLink className="mt-3" href={"/ny-bruker"}>
                Opprett bruker her!
              </NavLink>
              <NavLink href={"/nytt-passord"}>Glemt passord</NavLink>
            </Form>
          </div>
        </Card>
      </Container>
    );
  }
}
