import { Component } from "react-simplified";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { SortedEventView, SortingOptions } from "./sortedeventview";
import * as React from "react";
import { Event, service, Ticket } from "../services";
import NavLink from "react-bootstrap/NavLink";

export class LandingPage extends Component {
  state = {
    sortOption: { field: "", order: "asc" },
    events: [],
  };

  tickets = [];
  searchevents = [];

  render() {
    return (
      <div>
        <div className={"landingpage container"}>
          <Row className={"p-4"}>
            <Col>
              <h1 className="HarmoniLogo logo-big text-center">Harmoni</h1>
            </Col>
          </Row>
          <Row className={"p-5"}>
            <Col className="text-center">
              <h2>
                <NavLink href="/logg-inn">
                  <u className="text-white">Logg inn</u>
                </NavLink>{" "}
                for å se dine arrangementer
              </h2>
            </Col>
          </Row>
          <Row className={"p-5"}>
            <Col className="text-center mt-5">
              <NavLink href="#scrollTo">
                <h2 className="text-white">
                  <u>Bla ned</u> for å se arrangementer
                </h2>
                <i
                  className="fa fa-angle-down"
                  style={{ "font-size": "64px", color: "white" }}
                ></i>
              </NavLink>
            </Col>
          </Row>
        </div>
        <div>
          <SortedEventView />
        </div>
      </div>
    );
  }

  mounted() {
    service
      .getEvents()
      .then((events) => this.handleEvents(events))
      .catch((error) => console.error(error));
  }

  getTicketPrice(eventId) {
    service
      .getTicketToEvent(eventId)
      .then((tickets) => {
        this.tickets = tickets;
        let lowestPrice = tickets[0].price;
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].price < lowestPrice) {
            lowestPrice = tickets[i].price;
          }
        }
        return lowestPrice;
      })
      .catch((error) => console.error(error));
  }

  scroll() {
    let element = document.getElementById("scrollTo");
    element.scrollIntoView({ behavior: "smooth" });
  }
}
