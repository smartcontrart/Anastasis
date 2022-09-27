import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
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

function Act1() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [quantity, setQuantity] =  useState(0);

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


    async function handleChange(event){    
        console.log(event.target.value)
        setQuantity(event.target.value)
    }

    function renderQuantityInput(){
        return(
            <Form style={{maxWidth: 200}}>
                <Form.Select onChange={handleChange} aria-label="Mint quantity">
                    <option value="invalid">Mint quantity</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </Form.Select>
            </Form>
        )
    }

    async function handleAshMint(){
        let allowance = accountInfo.act2ContractAllowance
        let price = accountInfo.ashPrice
        let ashApprovalFailed = false

        if(allowance < price){
            accountInfo.updateAccountInfo({userFeedback: "Approving ASH"})
            try{
                await accountInfo.ashInstance.methods.approve(accountInfo.act2MintAddress, (price).toString()).send({from: accountInfo.account})
                accountInfo.updateAccountInfo({contractAllowance: parseInt(await accountInfo.ashInstance.methods.allowance(accountInfo.account, accountInfo.ashAddress).call())})
            }
            catch (error){
                ashApprovalFailed = true
                accountInfo.updateAccountInfo({userFeedback: null})
                setAlert({active: true, content: error.message, variant: "warning"})
            }
        }
        if(!ashApprovalFailed){
            accountInfo.updateAccountInfo({userFeedback: "Minting..."})
            try{
                await accountInfo.act2MintAddress.methods.mint(
                    false,
                    quantity
                ).send({from: accountInfo.account});
            }
            catch(error){
                console.log(error)
                setAlert({active: true, content: error.message, variant: "danger"})
            }
        }
        accountInfo.updateAccountInfo({contractAllowance: parseInt(await accountInfo.ashInstance.methods.allowance(accountInfo.account, accountInfo.ashAddress).call())})
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    async function handleEthMint(){
        let price = (accountInfo.fomoBalance > 0 || accountInfo.ashBalamce > 25*10**18) ? accountInfo.holderPrice : accountInfo.publicPrice;
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.act2MintAddress.methods.mint(
                true,
                quantity
            ).send({from: accountInfo.account, value: (price * quantity).toString()});
        }
        catch(error){
            setAlert({active: true, content: error.message, variant: "danger"})
        }
    }


    async function handleFreeMint(){
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.act2MintAddress.methods.getFreeMint(
                accountInfo.signedMessageAct2.v,
                accountInfo.signedMessageAct2.r,
                accountInfo.signedMessageAct2.s
            ).send({from: accountInfo.account});
        }
        catch(error){
            setAlert({active: true, content: error.message, variant: "danger"})
        }
        accountInfo.updateAccountInfo({hasMintedFreeAct2Token: await accountInfo.Act2MintInstance._biddersHasMinted(this.context.account).call()});
    }

    function renderUserInterface(){
        if(!window.ethereum){
            return <div className="text-left"> No wallet detected</div>
        }else{
            if(accountInfo.account){
                if(accountInfo.act2Opened){
                    if(accountInfo.signedMessageAct2 && !accountInfo.hasMintedFreeAct2Token){
                        return (
                            <Row>
                                <Button variant='secondary' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handleFreeMint()}>Free Mint</Button>
                            </Row>
                        )
                    }else{
                        return(
                            <React.Fragment>
                        <Row>
                            <Container>
                                <Row>
                                    <Col className="m-2 xs-center d-flex no_padding">
                                        {renderQuantityInput()}
                                    </Col>
                                </Row>
                            </Container>
                        </Row>
                        <Row className="xs-center d-flex no_padding">
                            <Button variant='light' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handleEthMint()}>Mint in ETH</Button>
                            <Button variant='outline-light' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handleAshMint()}>Mint in ASH</Button>
                        </Row>
                            </React.Fragment>
                        )
                    }
                }else{
                    return <div className="text-left"><b>Drop Closed</b></div>
                }
            }else{
                return <div>Please connect your wallet</div>
            }
        }
    }

    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5">
                <h1><b>f-1 Anastasis - Act 2: The Open Edition</b></h1>
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
                                <span className="xs-center text-left"><b>Maximum 30 pieces per wallet, 10  per transaction</b></span>
                                <span className="xs-center text-left"><b>One free piece for each bidder of Anastasis: the Auction</b></span>
                                <span className="xs-center text-left"><b>Buy in Ash or Eth, discount for holders of FOMOverse and 25 Ash</b></span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Ash price: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    20 Ash
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Holders of FOMOverse and 25 ASH price: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    0.015 ETH
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Public price: 
                            </span>
                            <br/>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    0.02 ETH
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

export default Act1;


