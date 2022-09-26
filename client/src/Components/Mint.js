import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";

import '../App.css'

function Mint() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})

    async function handleMint(){
        let price = accountInfo.mintPrice
        accountInfo.updateAccountInfo({userFeedback: `Minting an AIGirl for ${price/10**18} ETH...`})
        try{
            await accountInfo.AIGirlsInstance.methods.publicMint(
                    ).send({from: accountInfo.account, value: price});
            displayAlert('Mint successful!', 'success')
        }catch(error){
            displayAlert(error.message, 'warning')
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }

    function renderButtons(){
        if(!accountInfo.dropOpened){
            return <div>The drop is currently closed.<br/>Please head to <a href="https://opensea.io/collection/aigirl-v2" style={{color: 'white'}} target="_blank" rel="noopener noreferrer"><b>Opensea</b></a> to get an AI girl!</div>
        }else if(accountInfo.walletETHBalance < accountInfo.mintPrice){
            return(
                <div>
                    Not enough ETH to mint...
                </div>
            )
        }else{
            return <Button variant="light" onClick={()=>handleMint()}>Mint</Button>
        }
    }

    function renderUserInterface(){

        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else{
            return(
                <Container>
                    <Row>
                        <Col className="d-flex align-items-center justify-content-center m-2">
                            {renderButtons()}
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    function renderUserFeedback(){
        if(accountInfo.userFeedback){
            return(
                <React.Fragment>
                    <div>
                        <Spinner animation="grow" variant="light"/>
                    </div>
                    <div>{accountInfo.userFeedback}</div>
                </React.Fragment>
            )
        }
    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-3'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }

    }

    return ( 
        <Container>
            <div className='blackOverlay'> </div>
            <Row>
                <h1><b>AI GIRLS</b></h1>
            </Row>
            <Row id="description_row">
                <span>A unique collection of 1/1 3D models</span>
                <span>Open Mint</span>
                <span>0.1 ETH</span>
            </Row>
            <Row>
                {renderUserInterface()}
            </Row>
            <Row className='m-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">
                {renderAlert()}
            </Row>
        </Container>
     );
}

export default Mint;


