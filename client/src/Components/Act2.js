import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import Timer from "./Timer";
import { AccountInfoContext } from "../Context/AccountInfo";
import visual from '../images/visuals Act2/act2 image.png'

import '../App.css'

function Act1() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [quantity, setQuantity] =  useState(0);
    const weAreLive = true;

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
        setQuantity(event.target.value)
    }

    function renderOptions(options){
        return(
            <React.Fragment>
                {options.map((option,idx)=>{
                    if(option ===0){
                        return <option value={option.toString()} key={idx}>Mint quantity</option>
                    }else{
                        return(
                            <option value={option.toString()} key={idx}>{option}</option>
                        )
                    }
                })}
            </React.Fragment>
        )
    }

    function renderQuantityInput(){

        let limit = accountInfo.act2Balance ? Math.min(10, 30 - accountInfo.act2Balance) : 10;
        let options = [...Array(limit + 1).keys()]
        return(
            <Form style={{maxWidth: 200}}>
                <Form.Select onChange={handleChange} aria-label="Mint quantity">
                    {renderOptions(options)}
                </Form.Select>
            </Form>
        )
    }

    async function handleAshMint(){
        let allowance = accountInfo.fundSplitAllowance
        let price = accountInfo.ashPrice
        let ashApprovalFailed = false
        if(quantity === 0){
            displayAlert('Please select a valid quantity', "warning");
            return null
        }
        if(allowance < price * quantity){
            accountInfo.updateAccountInfo({userFeedback: "Approving ASH"})
            try{
                await accountInfo.ashInstance.methods.approve(process.env.REACT_APP_MAINNET_CONTRACT_FUNDSPLIT_ADDRESS, (price*quantity).toString()).send({from: accountInfo.account})
                accountInfo.updateAccountInfo({contractAllowance: parseInt(await accountInfo.ashInstance.methods.allowance(accountInfo.account, accountInfo.ashAddress).call())})
            }
            catch (error){
                ashApprovalFailed = true
                accountInfo.updateAccountInfo({userFeedback: null})
                displayAlert(error.message, "warning")
            }
        }
        if(!ashApprovalFailed){
            accountInfo.updateAccountInfo({userFeedback: "Minting..."})
            try{
                await accountInfo.Act2MintInstance.methods.mint(
                    false,
                    quantity
                ).send({from: accountInfo.account});
                displayAlert('Mint Successful', "success")
            }
            catch(error){
                console.log(error)
                displayAlert(error.message, "danger")
            }
        }
        accountInfo.updateAccountInfo({contractAllowance: parseInt(await accountInfo.ashInstance.methods.allowance(accountInfo.account, accountInfo.ashAddress).call())})
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    async function handleEthMint(){
        if(quantity === 0){
            displayAlert('Please select a valid quantity', "warning");
            return null
        }
        let price = (accountInfo.fomoBalance >= 1 || accountInfo.ashBalance >= 25*10**18) ? accountInfo.holderPrice : accountInfo.publicPrice;
        

        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.Act2MintInstance.methods.mint(
                true,
                quantity
            ).send({from: accountInfo.account, value: (price * quantity).toString()});
            displayAlert('Mint Successful', "success")
        }
        catch(error){
            displayAlert(error.message, "danger")
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }


    async function handleFreeMint(){
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.Act2MintInstance.methods.getFreeMint(
                accountInfo.signedMessageAct2.v,
                accountInfo.signedMessageAct2.r,
                accountInfo.signedMessageAct2.s
            ).send({from: accountInfo.account});
            displayAlert('Mint Successful', "success")
        }
        catch(error){
            setAlert({active: true, content: error.message, variant: "danger"})
        }
        accountInfo.updateAccountInfo({hasMintedFreeAct2Token: await accountInfo.Act2MintInstance._biddersHasMinted(this.context.account).call()});
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function renderUserInterface(){
        if(!window.ethereum){
            return <div className="text-left"> No wallet detected</div>
        }else{
            if(accountInfo.account){
                if(accountInfo.act2Opened && weAreLive){
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
                    return <div>Drop Closed</div>
                }
            }else{
                return <div>Please connect your wallet</div>
            }
        }
    }

    function renderTimer(){
        let time = '06 Oct 2022 10:00:00 PST'
        if(Date.parse(time) - Date.now() < 0){
            return null
        }else{
            return(
                <React.Fragment>
                    <div className='xs-center text-left'>Time remaining</div>
                    <span className='xs-center  text-left mb-2'><b><Timer time={time}/></b></span>
                </React.Fragment>
            )
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
                     src={visual}
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
                            {renderTimer()}
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


