import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";

import '../App.css'

function Act3Creator() {
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


    async function handleFreeMint(){
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
        await accountInfo.Act3CreatorMintInstance.methods.getFreeMint(
                accountInfo.signedMessageAct3Creator.v,
                accountInfo.signedMessageAct3Creator.r,
                accountInfo.signedMessageAct3Creator.s
            ).send({from: accountInfo.account});
            displayAlert('Mint Successful', "success")
        }
        catch(error){
            setAlert({active: true, content: error.message, variant: "danger"})
        }
        accountInfo.updateAccountInfo({creatorHasMinted: await accountInfo.Act3CreatorMintInstance.methods._hasMinted(accountInfo.account).call()});
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function renderUserInterface(){
        if(!window.ethereum){
            return <div className="text-left"> No wallet detected</div>
        }else{
            if(accountInfo.account){
                if(accountInfo.creatorMintOpened){
                    if(accountInfo.signedMessageAct3Creator){
                        if(!accountInfo.creatorHasMinted){
                              return (
                                  <Row className="d-flex justify-content-center">
                                      <Button variant='secondary' style={{maxWidth: '150px'}} className='mx-2' onClick={()=>handleFreeMint()}>Free Mint</Button>
                                  </Row>
                              )
                          }else{
                              return <div  >Thank you for being a 'f'riend</div>
                          }
                    }else{
                        return <div  >This is only for creators!</div>
                    }
                }else{
                    return <div  >Drop Closed</div>
                }
            }else{
                return <div  >Please connect your wallet</div>
            }
        }
    }



    return ( 
        <Container>
            <Row className="d-flex align-items-center my-5">
                <h1><b>f-1 Anastasis - Act 3: The Limited Edition</b></h1>
                <h5 className=""><b>by the f-Collective</b></h5>
                <span> a secret mint page for the f-collective</span>
            </Row>
            {renderUserInterface()}
            <Row className='m-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">
                {renderAlert()}
            </Row>
        </Container>
     );
}

export default Act3Creator;


