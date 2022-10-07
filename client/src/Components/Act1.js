import React, {useState, useContext, useEffect, useCallback} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Timer from './Timer.js'
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
import fourteen from '../images/visuals Act1/14.png'

import '../App.css'

function Act1() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [bid, setBid] =  useState(0);
    const [topBid, setTopBid] = useState(0);
    const [minBid, setMinBid] = useState(0);
    const [topBidder, setTopBidder] = useState(0);
    const visuals = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, fourteen]
    const [visual, setVisual] = useState(0);
    
    const getAuctionInfo = useCallback(async () => {
        if(accountInfo.instancesLoaded){
            const topBid2 = parseFloat(await accountInfo.Act1MintInstance.methods._currentTopBid().call())
            const minBid2 = parseFloat(await accountInfo.Act1MintInstance.methods._minBid().call())
            const topBidder2 = getAccountStr(await accountInfo.Act1MintInstance.methods._highestBidder().call())
            setTopBid(topBid2)
            setMinBid(minBid2)
            setTopBidder(topBidder2)
        }
      }, [accountInfo.instancesLoaded])

    useEffect(()=>{
        let rnd = Math.floor(Math.random() * visuals.length)
        setVisual(rnd);
        getAuctionInfo();
    },[visuals.length, getAuctionInfo])


    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }

    function renderUserInterface(){
        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else if(accountInfo.act1Opened){
            return(
                <Container>
                    <Row>
                        <Col className="m-2 xs-center d-flex no_padding">
                            {renderBidInput()}
                        </Col>
                    </Row>
                </Container>
            )
        }else{ return <div className="xs-center text-left">Auction Ended</div>}
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
        if(event.target.value*(10**18) < accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid){
            setBid(accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid);
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
        accountInfo.updateAccountInfo({userFeedback: "Bidding..."})
        let minimumBid = accountInfo.auctionCurrentTopBid + accountInfo.auctionMinBid
        
        if(bid < minimumBid){
            displayAlert(`Minimum bid of ${minimumBid/10**18} not met.`,'warning')
        }else if(accountInfo.walletETHBalance < bid){
            displayAlert(`Not enough ETH to place the bid`,'warning')
        }else{
            let latestBid =  parseFloat(await accountInfo.Act1MintInstance.methods._currentTopBid().call())
            if(bid <= latestBid){
                displayAlert(`A higher bid was placed before yours`,'warning')
                getAuctionInfo()
            }else{
                try{
                    await accountInfo.Act1MintInstance.methods.placeBid(bid.toString()).send({from: accountInfo.account, value: bid})
                    displayAlert('Mint Successful', "success")
                    getAuctionInfo()
                }
                catch(error){
                    accountInfo.updateAccountInfo({userFeedback: null})
                    displayAlert(error.message,'warning')
                }
            }
        }
        accountInfo.updateAccountInfo({userFeedback: null})

    }

    function getAccountStr(account){
        let response = account.slice(0, 10) +  '...' + account.substring(account.length - 10)
        return response
      }

    function renderTimer(){
        let time = '04 Oct 2022 09:00:00 PST'
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
                <h1><b>f-1 Anastasis - Act 1: The Auction</b></h1>
                <h5 className=""><b>by the f-Collective</b></h5>
            </Row>
            <Row id="description_row">
                <Col xs={12} lg={6} className='mb-5'>
                    <img
                     src={visuals[visual]}
                     alt='visual'
                     className="visual">

                     </img>
                </Col>
                <Col xs={12} lg={6} className='d-flex'>
                    <Container fluid className='larger-text'>
                        <Row className="text_left mb-3">
                                <span className="xs-center text-left large-text"><b>14 artists in one ever changing NFT</b></span>
                        </Row>
                        <Row>
                            {renderTimer()}
                        </Row>
                        <Row>
                            <span className="xs-center text-left">
                                Winning Bid: 
                            </span>
                            <br/>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {topBid/(10**18)}
                                </b>
                            </span>
                        </Row>
                        <Row>
                            <span className="xs-center text-left">
                            Auction Winner: 
                            </span>
                            <span className="xs-center text-left mb-3">
                                <b>
                                    {topBidder}
                                </b>
                            </span>
                        </Row>
                        <Row xs={12}>
                            {renderUserInterface()}
                        </Row>
                        <Row className="xs-center d-flex">
                            {(accountInfo.act1Opened && accountInfo.account) ? <Button variant='light' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleBid()}>Bid</Button> : null}
                        </Row>
                    </Container>
                </Col>
            </Row>
            <Row className='mb-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">  
                {renderAlert()}
            </Row>
        </Container>
     );
}

export default Act1;


