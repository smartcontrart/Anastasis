import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import one from '../images/visuals Act1/1.png'
import two from '../images/visuals Act1/2.png'
import three from '../images/visuals Act1/3.png'
import four from '../images/visuals Act1/4.png'
import five from '../images/visuals Act1/5.png'
import six from '../images/visuals Act1/6.png'
import seven from '../images/visuals Act1/7.png'
import eight from '../images/visuals Act1/8.png'
import nine from '../images/visuals Act1/9.png'
import ten from '../images/visuals Act1/10.png'
import eleven from '../images/visuals Act1/11.png'
import twelve from '../images/visuals Act1/12.png'

import '../App.css'

function Act3() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})

    const visuals = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve]     

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
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
            <Col className='m-2'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }
    }

    async function handleMint(){
        let price = accountInfo.price
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        if(accountInfo.publicMintOpened){
            try{
                await accountInfo.act2MintAddress.methods.publicMint(
                ).send({from: accountInfo.account, value: (price).toString()});
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }else if(accountInfo.ALMintOpened){
            try{
                await accountInfo.act2MintAddress.methods.selectedMint(
                    accountInfo.signedMessageAct3.v,
                    accountInfo.signedMessageAct3.r,
                    accountInfo.signedMessageAct3.s
                ).send({from: accountInfo.account, value: (price).toString()});
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }else if(accountInfo.ashMintOpened){
            try{
                await accountInfo.act2MintAddress.methods.ashHoldersMint(
                ).send({from: accountInfo.account, value: (price).toString()});
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }else if(accountInfo.FOMOMintOpened){
            try{
                await accountInfo.act2MintAddress.methods.fomoHoldersMint(
                ).send({from: accountInfo.account, value: (price).toString()});
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }
    }

    function renderUserInterface(){
        if(!window.ethereum){
            return <div className="text-left"> No wallet detected</div>
        }else{
            if(accountInfo.account){
                if(accountInfo.FOMOMintOpened || accountInfo.ashMintOpened || accountInfo.ALMintOpened || accountInfo.publicMintOpened){
                    return (
                        <Row>
                            <Button variant='secondary' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handleMint()}>Mint</Button>
                        </Row>
                    )
                }else{
                    return <div className="text-left"><b>Drop Closed</b></div>
                }
            }else{
                return <div>Please connect your wallet</div>
            }
        }
    }

    function renderCurrentMinters(){
        if(accountInfo.publicMintOpened){
            return(
                <div>Public Mint</div>
            )
        }else if(accountInfo.ALMintOpened){
            return(
                <div>Allow List</div>
            )
        }else if(accountInfo.ashMintOpened){
            return(
                <div>Ash holders</div>
            )
        }else if(accountInfo.FOMOMintOpened){
            return(
                <div>FOMO holders</div>
            )
        }else{
            return null
        }
    }

    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5">
                <h1><b>f-1 Anastasis - Act 3: The Limited Edition</b></h1>
                <h5 className=""><b>by the f-Collective</b></h5>
            </Row>
            <Row id="description_row">
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={one}
                     alt='visual'
                     className="visual">

                     </img>
                </Col>
                <Col xs={12} lg={6} className='d-flex'>
                    <Container fluid className='larger-text'>
                        <Row className="text_left mb-3">
                                <span className="xs-center text-left"><b>14 artists in 14 pieces.</b></span>
                                <span className="xs-center text-left"><b>33 editon per piece</b></span>
                                <span className="xs-center text-left"><b>A sequenced drop: </b>
                                    <ul>
                                        <li>
                                            Holders of FOMO;
                                        </li>
                                        <li>
                                            Holders of 25Ash and Anastasis: the Open Edition;
                                        </li>
                                        <li>
                                            Allow List;
                                        </li>
                                        <li>
                                            Public;
                                        </li>
                                    </ul>
                                </span>
                                
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                One price: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    0.03ETH
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Current Mint: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {renderCurrentMinters()}
                                </b>
                            </span>
                        </Row>
                        {renderUserInterface()}
                    </Container>
                </Col>
            </Row>
            <Row>
                
                
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

export default Act3;


