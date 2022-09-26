import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import Connect from './Components/Connect';
import Mint from './Components/Mint';
import Rename from './Components/Rename';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import ContractInfoProvider from './Context/ContractInfo';
import DropConfigProvider from './Context/DropConfig.js';
import {Routes,Route} from "react-router-dom";
import NavigationBar from './Components/Navigationbar';
import About from './Components/About';
import Gallery from './Components/Gallery';
import background from './images/background.jpg'
import './App.css'

function App() {
  return (
    <DropConfigProvider>
        <AccountInfoProvider>
          <ContractInfoProvider>
              <NavigationBar/>
            <div className="background d-flex align-items-center justify-content-center" style={{backgroundImage: `url(${background})`,}}>
              <div className="App d-flex align-items-center justify-content-center">
              {/* <div className="background d-flex align-items-center justify-content-center"> */}
                <Container>
                    <Row id='App_row' className="d-flex align-items-center justify-content-center">
                      <Col className="d-flex align-items-center justify-content-center">
                        <Routes>
                          <Route path="/" element={<Mint/>}/>
                          <Route path="/about" element={<About/>}/>
                          <Route path="/gallery" element={<Gallery />} />
                          <Route path="/rename" element={<Rename />} />
                          {/* <Route path="/my_orders" element={<Orders />} /> */}
                        </Routes>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="d-flex align-items-center justify-content-center">
                        <ConnexionStatus/>
                      </Col>
                    </Row>
                </Container>
              </div>
            </div>
          </ContractInfoProvider>
        </AccountInfoProvider>
      </DropConfigProvider>
  );
}

export default App;