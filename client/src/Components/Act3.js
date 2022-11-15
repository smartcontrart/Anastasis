import React, {useState, useContext, useEffect} from "react";
import {Container, Row, Col, Button, Spinner, Alert} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import one from '../images/visuals Act3/1.png'
import two from '../images/visuals Act3/2.png'
import three from '../images/visuals Act3/3.png'
import four from '../images/visuals Act3/4.png'
import five from '../images/visuals Act3/5.png'
import six from '../images/visuals Act3/6.png'
import seven from '../images/visuals Act3/7.png'

import '../App.css'

function Act3() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const visuals = [one, two, three, four, five, six, seven]     
    const [visual, setVisual] = useState(0);
    
    useEffect(()=>{
        let rnd = Math.floor(Math.random() * visuals.length)
        setVisual(rnd);
    },[visuals.length])

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

    async function handlePublicMint(){
        let price = accountInfo.price
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.Act3MintInstance.methods.publicMint(
            ).send({from: accountInfo.account, value: (price).toString()});
            displayAlert('Mint Successful', "success")
        }
        catch(error){
            displayAlert(error.message, "danger")
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    async function handleAshPublicMint(){
        let allowance = accountInfo.fundSplitAllowance
        console.log(price)
        let price = accountInfo.ashPriceAct3
        console.log(price)
        if(accountInfo.ashBalance < price){
            displayAlert('Insufficient Ash Balance', "warning")
        }else{
            let ashApprovalFailed = false
            if(allowance < price){
                accountInfo.updateAccountInfo({userFeedback: "Approving ASH"})
                try{
                    await accountInfo.ashInstance.methods.approve(process.env.REACT_APP_MAINNET_CONTRACT_FUNDSPLIT_ADDRESS, (price).toString()).send({from: accountInfo.account})
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
                    await accountInfo.Act3AshMintInstance.methods.publicAshMint().send({from: accountInfo.account});
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
    }


    async function handlePrivateMint(){
        let price = accountInfo.price
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        if(accountInfo.ALMintOpened && accountInfo.signedMessageAct3){
            try{
                await accountInfo.Act3MintInstance.methods.selectedMint(
                    accountInfo.signedMessageAct3.v,
                    accountInfo.signedMessageAct3.r,
                    accountInfo.signedMessageAct3.s
                ).send({from: accountInfo.account, value: (price).toString()});
                displayAlert('Mint Successful', "success")
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }else if(accountInfo.ashMintOpened && accountInfo.ashBalance >= (25*10**18) && accountInfo.act2Balance >= 1){
            try{
                await accountInfo.Act3MintInstance.methods.ashHoldersMint(
                ).send({from: accountInfo.account, value: (price).toString()});
                displayAlert('Mint Successful', "success")
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }else if(accountInfo.FOMOMintOpened && accountInfo.fomoBalance >= 1){
            try{
                await accountInfo.Act3MintInstance.methods.fomoHoldersMint(
                ).send({from: accountInfo.account, value: (price).toString()});
                displayAlert('Mint Successful', "success")
            }
            catch(error){
                displayAlert(error.message, "danger")
            }
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function renderEthButton(){
        if(accountInfo.hasMintedAct3PublicSale){
            return null
        }else{
            return <Button variant='secondary' style={{maxWidth: '150px'}} className='mx-2 mb-2' onClick={()=>handlePublicMint()}>Mint in Eth</Button>
        }
    }

    function renderAshButton(){
        return <Button variant='light' style={{maxWidth: '150px'}} className='mx-2 mb-2' onClick={()=>handleAshPublicMint()}>Mint in Ash</Button>
    }

    

    function renderPublicSaleButton(){
        return(
            <Row className="mb-3 d-flex justify-content-left xs-center">
                {renderEthButton()}
                {renderAshButton()}
            </Row>
        )
    }

    function renderPrivateSaleButton(){
        return(
            <Row className="mb-3 d-flex justify-content-left xs-center">
                <Button variant='outline-light' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handlePrivateMint()}>Mint Private Sale</Button>
            </Row>
        )
    }

    function renderPrivateSaleInterface(){
        if(accountInfo.account){
            let isFOMOHolder = accountInfo.fomoBalance >= 1 ? true : false;
            let isASHOEHolder = accountInfo.act2Balance >= 1 && accountInfo.ashBalance >= (25*10**18) ? true : false;
            let isAL = accountInfo.signedMessageAct3 ? true :  false
            
            if( (accountInfo.FOMOMintOpened && isFOMOHolder) ||
                (accountInfo.ashMintOpened && isASHOEHolder) ||
                (accountInfo.ALMintOpened && isAL)) {
                if(accountInfo.hasMintedAct3PrivateSale && !accountInfo.hasMintedAct3PublicSale){
                    return null
                }else if(accountInfo.hasMintedAct3PrivateSale && accountInfo.hasMintedAct3PublicSale){
                    return null
                }else{
                    return renderPrivateSaleButton()
                }
            }else{
                return null
            }
        }
    }

    function renderPublicSaleInterface(){
        if(accountInfo.account){
            if( accountInfo.publicMintOpened) {
                if(accountInfo.hasMintedAct3PublicSale){
                    return <div className="xs-center text-left">Thank you for minting!</div>
                }else{
                    return renderPublicSaleButton()
                }
            }else{
                return null
            }
        }
    }

    function renderUserInterface(){
        if(!window.ethereum){
            return <div className="text-left"> No wallet detected</div>
        }else{
            if(accountInfo.account){
                if(!accountInfo.FOMOMintOpened && !accountInfo.ashMintOpened && !accountInfo.ALMintOpened){
                    return <div>Drop currently closed</div>
                }else{
                    return(
                        <React.Fragment>
                            {renderPrivateSaleInterface()}
                            {renderPublicSaleButton()}
                        </React.Fragment>
                    )
                }
            }
        }
    }
                

    // function renderUserInterface(){
    //     if(!window.ethereum){
    //         return <div className="text-left"> No wallet detected</div>
    //     }else{
    //         if(accountInfo.account){
    //             if(accountInfo.publicMintOpened){
    //                 if(accountInfo.hasMintedAct3PublicSale){
    //                     return <div className="text-left">Thank you for minting !</div>
    //                 }else{
    //                     if(accountInfo.signedMessageAct3 || (accountInfo.act2Balance >= 1 && accountInfo.ashBalance >= (25*10**18)) || accountInfo.fomoBalance >= 1){
    //                         return(
    //                             <React.Fragment>
    //                                 {renderPrivateSaleButton()}
    //                                 {renderPublicSaleButton()}
    //                             </React.Fragment>
    //                         )
    //                     }else{
    //                         return renderPublicSaleButton()
    //                     }
    //                 }
    //             }else if(accountInfo.ALMintOpened|| accountInfo.ashMintOpened || accountInfo.FOMOMintOpened){
    //                 if(accountInfo.hasMintedAct3PrivateSale){
    //                     return <div className="text-left">Thank you for minting during the private sale.<br/> Please come back during the public sale</div>
    //                 }else if(accountInfo.signedMessageAct3){
    //                     return renderPrivateSaleButton()
    //                 }else{
    //                     return <div>Not eligible to mint</div>
    //                 }
    //             }else if(accountInfo.ashMintOpened || accountInfo.FOMOMintOpened){
    //                 if(accountInfo.hasMintedAct3PrivateSale){
    //                     return <div className="text-left">Thank you for minting during the private sale.<br/> Please come back during the public sale</div>
    //                 }else if(accountInfo.act2Balance >= 1 && accountInfo.ashBalance >= (25*10**18)){
    //                     return renderPrivateSaleButton()
    //                 }else{
    //                     return <div>Not eligible to mint</div>
    //                 }
    //             }else if(accountInfo.FOMOMintOpened){
    //                 if(accountInfo.hasMintedAct3PrivateSale){
    //                     return <div className="text-left">Thank you for minting during the private sale.<br/> Please come back during the public sale</div>
    //                 }else if(accountInfo.fomoBalance >= 1 ){
    //                     return renderPrivateSaleButton()
    //                 }else{
    //                     return <div>Not eligible to mint this phase. That will change!</div>
    //                 }
    //             }else{
    //                 return <div>Drop Closed</div>
    //             }
    //         }else{
    //             return <div>Please connect your wallet</div>
    //         }
    //     }
    // }

    function renderCurrentMinters(){
        if(accountInfo.publicMintOpened){
            return(
                <div>Public Mint</div>
            )
        }else if(accountInfo.ALMintOpened){
            return(
                <div>FOMO holders <br/>Ash and Anastasis Act 2 holders <br/>Allow List</div>
            )
        }else if(accountInfo.ashMintOpened){
            return(
                <div>FOMO holders <br/> Ash and Anastasis Act 2 holders</div>
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
                     src={visuals[visual]}
                     alt='visual'
                     className="visual">

                     </img>
                </Col>
                <Col xs={12} lg={6} className='d-flex'>
                    <Container fluid className='larger-text'>
                        <Row className="text_left mb-3">
                                <span className="xs-center text-left"><b>8 artists in 8 pieces.</b></span>
                                <span className="xs-center text-left"><b>33 editions per piece</b></span>
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
                                    0.03ETH or 40 Ash
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


