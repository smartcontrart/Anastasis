import React, {useState, useContext} from "react";
import {Row, Col, Spinner, Button, Form, Container, Alert} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import '../App.css'


function Rename() {
    let accountInfo = useContext(AccountInfoContext)
    const [girlId, setGirlId] = useState('')
    const [girlName, setGirlName] = useState('')
    const [alert, setAlert] = useState({active: false, content: null, variant: null})


    async function handleIdChange(event){
        if(event.target.value >= 5000){
            setGirlId(5000);
        }else{
            setGirlId(event.target.value)
        }
    }

    async function handleNameChange(event){
        setGirlName(event.target.value)
    }

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
            <Col className='m-3'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }

    }
    

    async function handleRename(){
        console.log('here')
        let price = accountInfo.nameChangePrice
        accountInfo.updateAccountInfo({userFeedback: "Verifying ownership..."})
        try{
            let owner = await accountInfo.AIGirlsInstance.methods.ownerOf(girlId).call();
            if(owner === accountInfo.account){
                displayAlert('Ownership confirmed, Rename allowed', 'success')
                try{
                   await  accountInfo.AIGirlsInstance.methods.nameGirl(girlId, girlName).send({from: accountInfo.account, value: price})
                   displayAlert('Renaming successful!', 'success')
                }
                catch(error){
                    displayAlert(error.message, 'warning')
                }
            }else{
                displayAlert(`You are not the owner of girl ${girlId}`, 'warning')
            }
        }
        catch(error){
            displayAlert(error.message, 'warning')
        }
        accountInfo.updateAccountInfo({userFeedback:null})
    }

    function renderNameChangeForm(){
        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else if(!accountInfo.nameChangeActivated){
            return(
                <Row>
                    <Col>
                        Name Change not activated, please come back later!
                    </Col>
                </Row>
            )
        }else{
            return(
                <React.Fragment>
                    <Row>
                        <h2>Rename your girl</h2>
                        <div>To rename your girl, enter her ID and the name you want to give her</div>
                        <div>Once the transaction is confirmed on the Blockchain, your girl will have her new name</div>
                        <div className="mt-3">Name change is free until the collection has 100 girls minted, then it will be 0.02ETH + gas</div>
                        <div>Mint yours now to rename it for free!</div>
                    </Row>
                    <Row>
                        <Col className="d-flex align-items-center justify-content-center m-2">
                            <Form id='mint_form'>
                                <Form.Group  controlId="girl_id" className="m-2">
                                    <Form.Control 
                                        type="number" 
                                        min="0"
                                        placeholder="AIGirl ID"
                                        value={girlId}
                                        onChange={(event) => handleIdChange(event)}/>
                                </Form.Group>
                                <Form.Group  controlId="girl_name" className="m-2">
                                    <Form.Control 
                                        placeholder="Girl's name"
                                        value={girlName}
                                        onChange={(event) => handleNameChange(event)}/>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="mb-5" variant='outline-light' onClick={()=>handleRename()}>Rename!</Button>
                        </Col>
                    </Row>
                </React.Fragment>
            )
        }
    }

    return ( 
        <Container>
            {renderNameChangeForm()}
            <Row className='m-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">
                {renderAlert()}
            </Row>
        </Container>
     );
}
export default Rename;


