import React from "react";
import {Container, Row, Col} from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import smartcontrart from '../images/smartcontrart.jpeg'
import elyx from '../images/elyx.jpg'
import twitter_logo from '../images/twitter_logo.png'
import '../App.css'

function About() {

    return ( 
        <Container>
            <Row>
                <Col className="m-5">
                    <h3>About</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    AIGirls.xyz is a limited collection with a maximum of 5,000 3D models made by Elyx with AI. 
                    <br/>Using a custom smart contract, each girl can be named after her owner an unlimited number of times. 
                    <br/>You can get a random girl by minting it on the website, or choose your own girl from the collection available on <a href="https://opensea.io/collection/aigirl-v2" style={{color: 'white'}} target="_blank" rel="noopener noreferrer"><b>Opensea</b></a>.
                    <br/>Click on "Rename" to change the name of your new AI Girl, you will only have to enter your girl's id, her new name and confirm the transaction with your wallet.
                </Col>
            </Row>
            <Row>
                <Col className="m-5">
                    <h3>The team behind the project</h3>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: '18rem' }}
                    bg='dark'
                    text='light'>
                        <Card.Img variant="top" src={elyx} />
                        <Card.Body>
                            <Card.Title className="text-left">Elypse2021    <a href="https://twitter.com/Elypse2021" target="_blank" rel="noopener noreferrer"> <img
                                src={twitter_logo}
                                alt="twitter_link"
                                width="20"
                                height="20"/></a></Card.Title>
                            <Card.Text className="text-left">
                                Mother, Writer. Creator/Collector. Poetess. Art Manager. 'Blockchain like imagination has no limits' elycrypto.eth CEO 
                                
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                    <Card 
                        style={{ width: '18rem' }} 
                        bg='dark'
                        text='light'>
                        <Card.Img variant="top" src={smartcontrart}/>
                        <Card.Body>
                            <Card.Title className="text-left">Smartcontrart       <a href="https://twitter.com/SmartContrart" target="_blank" rel="noopener noreferrer"> <img
                                src={twitter_logo}
                                alt="twitter_link"
                                width="20"
                                height="20"/></a></Card.Title>
                            <Card.Text className="text-left">
                                Software engineer, Smart Contract developer, Art entusiast. Code is art. Smart contract a new medium.
                                {/* <br/><a href="https://twitter.com/SmartContrart" style={{color: 'white'}} target="_blank" rel="noopener noreferrer">Follow on Twitter</a> */}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
     );
}

export default About;


