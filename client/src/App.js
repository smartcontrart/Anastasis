import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import Connect from './Components/Connect';
import Home from './Components/Home';
import Act1 from './Components/Act1';
import Act2 from './Components/Act2';
import Act3 from './Components/Act3';
import Act3Creator from './Components/Act3Creator';
import Team from './Components/Team';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import ContractInfoProvider from './Context/ContractInfo';
import DropConfigProvider from './Context/DropConfig.js';
import {Routes,Route} from "react-router-dom";
import NavigationBar from './Components/Navigationbar';
import background from './images/background.png'
import './App.css'

function App() {
  return (
    <DropConfigProvider>
        <AccountInfoProvider>
          <ContractInfoProvider>
              <NavigationBar/>
            <div className="background" style={{backgroundImage: `url(${background})`,}}>
              <div className="App d-flex align-items-center justify-content-center">
              {/* <div className="background d-flex align-items-center justify-content-center"> */}
                <Container>
                    <Row id='App_row' className="d-flex align-items-center justify-content-center">
                      <Col className="d-flex align-items-center justify-content-center">
                        <Routes>
                          <Route path="/" element={<Home/>}/>
                          <Route path="/act1" element={<Act1/>}/>
                          <Route path="/act2" element={<Act2/>}/>
                          <Route path="/act3" element={<Act3 />}/>
                          <Route path="/team" element={<Team />}/>
                          <Route path="/friends" element={<Act3Creator />}/>
                        </Routes>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
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