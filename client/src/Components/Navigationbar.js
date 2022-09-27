import React from "react";
import { Container, Navbar, Nav} from "react-bootstrap";
import twitter_logo from '../images/twitter_logo.png'
import os_logo from '../images/OS.png'
import logo from '../images/FOMO.png'
import Connect from "./Connect.js";
import '../App.css'
import { Link } from "react-router-dom";


export default function NavigationBar() {
  return (
    <React.Fragment >
      <Navbar id="black" className="navbar" bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand >
        <Link to="/">
          <img
            className="d-block"
            src={logo}
            alt="fomo_logo"
            width="60"
          />
        </Link>
        </Navbar.Brand>
        <Navbar.Text className='mx-1'>
              <a href="https://twitter.com/F__Collective" target="_blank" rel="noopener noreferrer"> <img
                src={twitter_logo}
                alt="twitter_link"
                width="20"
                height="20" /></a>
          </Navbar.Text>    
          <Navbar.Text className='mx-1'>
              <a href="https://opensea.io/collection/" target="_blank" rel="noopener noreferrer"> <img
                src={os_logo}
                alt="opensea_link"
                width="20"
                height="20" /></a>
          </Navbar.Text>  
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="mx-2" href="/act1">Act1</Nav.Link>
            <Nav.Link className="mx-2" href="/act2">Act2</Nav.Link>
            <Nav.Link className="mx-2" href="/act3">Act3</Nav.Link>
          </Nav>
          <Connect/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </React.Fragment>
  );
}
