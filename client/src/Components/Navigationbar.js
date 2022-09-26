import React from "react";
import { Container, Navbar, Nav} from "react-bootstrap";
import twitter_logo from '../images/twitter_logo.png'
import os_logo from '../images/OS.png'
import logo from '../images/white_logo.PNG'
import Connect from "./Connect.js";
import '../App.css'


export default function NavigationBar() {
  return (
    <React.Fragment >
      <Navbar id="black" className="navbar" bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand >
        <img
          className="carousel_illustration d-block"
          src={logo}
          alt="aigirls_logo"
          width="60"
        />
        </Navbar.Brand>
        <Navbar.Text className='mx-1'>
              <a href="https://twitter.com/AIGirlsxyz" target="_blank" rel="noopener noreferrer"> <img
                src={twitter_logo}
                alt="twitter_link"
                width="20"
                height="20" /></a>
          </Navbar.Text>    
          <Navbar.Text className='mx-1'>
              <a href="https://opensea.io/collection/aigirl-v2" target="_blank" rel="noopener noreferrer"> <img
                src={os_logo}
                alt="opensea_link"
                width="20"
                height="20" /></a>
          </Navbar.Text>  
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Mint</Nav.Link>
            <Nav.Link href="/rename">Rename</Nav.Link>
            <Nav.Link href="/gallery">Gallery</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          <Connect/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </React.Fragment>
  );
}
