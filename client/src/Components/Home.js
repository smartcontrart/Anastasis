import React from "react";
import {Container, Row, Col} from 'react-bootstrap'
import { Link } from "react-router-dom";

import '../App.css'

function Act1() {

    return ( 
        <Container style={{height: '75vh'}}>
            <Row style={{fontSize: '2rem', fontWeight: 'bold'}}>
                <Col>Anastasis</Col>
            </Row>
            <Row style={{fontSize: '1.5rem'}} className='mb-5'>
                <Col>
                <span>by the f-collective</span><br/>
                <span>a tribute to the FOMOverse in 3 Acts</span>
                </Col>
            </Row>
            <Row style={{fontSize: '1.2rem'}} className='mb-5'>
                <Col xs={12}>
                    
                    <span>NO PROMISES</span><br/>
                    <span>NO ROADMAP</span><br/>
                    <span>NO UTILITY</span><br/>
                </Col>
            </Row>
            <Row style={{fontSize: '1.2rem'}} className='mb-5'>
                <Col className="grow"><Link to='/act1'  style={{color: 'white', textDecoration: 'none'}}>ACT1: the Auction</Link></Col>
            </Row>
            <Row style={{fontSize: '1.2rem'}} className='mb-5'>
                <Col className="grow"><Link to='/act2' style={{color: 'white', textDecoration: 'none'}}>ACT2: the Open Edition</Link></Col>
            </Row>
            <Row style={{fontSize: '1.2rem'}} className='mb-5'>
                <Col className="grow"><Link to='/act3' style={{color: 'white', textDecoration: 'none'}}>ACT3: the Limited Edition</Link></Col>
            </Row>
        </Container>
     );
}

export default Act1;


