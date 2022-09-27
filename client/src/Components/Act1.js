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
    const [bid, setBid] =  useState(0);

    const visuals = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve]

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }

    function renderUserInterface(){

        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else{
            return(
                <Container>
                    <Row>
                        <Col className="m-2 xs-center d-flex no_padding">
                            {renderBidInput()}
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
            <Col className='m-'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }
    }


    async function handleChange(event){
        if(event.target.value*(10**18) < accountInfo.currentLuxTopBid + accountInfo.minBid){
            setBid(accountInfo.currentLuxTopBid + accountInfo.minBid);
        }else{
            setBid(event.target.value*10**18)
        }

    }

    function renderBidInput(){
        return(
            <Form style={{maxWidth: 100}}>
                <Form.Group  controlId="bid">
                    <Form.Control 
                        type="number" 
                        min="0"
                        step=".01"
                        placeholder={bid/10**18}
                        value={bid/10**18}
                        onChange={(event) => handleChange(event)}/>
                </Form.Group>
            </Form>
        )
    }

    async function handleBid(){

        let minimumBid = accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid
        if(bid < minimumBid){
            displayAlert(`Minimum bid of ${minimumBid/10**18} not met.`,'warning')
        }else if(accountInfo.walletETHBalance < bid){
            displayAlert(`Not enough ETH to place the bid`,'warning')
        }else{
            try{
                await accountInfo.Act1MintInstance.methods.placeBid(bid.toString()).send({from: accountInfo.account, value: bid})
                accountInfo.updateAccountInfo({auctionCurrentTopBid: parseFloat(await this.Act1MintInstance.methods._currentTopBid().call())})
                accountInfo.updateAccountInfo({auctionMinBid: parseFloat(await this.Act1MintInstance.methods._minBid().call())})
                accountInfo.updateAccountInfo({auctionHighestBidder: parseFloat(await this.Act1MintInstance.methods._highestBidder().call())})
            }
            catch(error){
                accountInfo.updateAccountInfo({userFeedback: null})
                displayAlert(error.message,'warning')
            }
        }

    }

    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5">
                <h1><b>f-1 Anastasis - Act 1: The Auction</b></h1>
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
                        <Row className="text_left mb-5">
                                <span className="xs-center text-left large-text"><b>14 artists in one ever changing NFT</b></span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Reserve Price: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {accountInfo.auctionReservePrice}   
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                                Current Bid: 
                            </span>
                            <br/>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {accountInfo.auctionCurrentTopBid/(10**18)}
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left mb-2">
                            Minimum Bid: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {(accountInfo.auctionMinBid + accountInfo.auctionCurrentTopBid)/(10**18)}
                                </b>
                            </span>
                        </Row>
                        <Row xs={12} >
                            {renderUserInterface()}
                        </Row>
                        <Row className="xs-center d-flex">
                            {accountInfo.act1Opened ? <Button variant='light' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleBid()}>Bid</Button> : null}
                        </Row>
                    </Container>
                </Col>
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


