import React from "react";
import {Container, Row, Col} from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import Girl1 from '../images/Girls/1.png'
import Girl2 from '../images/Girls/2.png'
import Girl3 from '../images/Girls/3.png'
import Girl4 from '../images/Girls/4.png'
import Girl5 from '../images/Girls/5.png'
import Girl6 from '../images/Girls/6.png'
import Girl7 from '../images/Girls/7.png'
import Girl8 from '../images/Girls/8.png'
import Girl9 from '../images/Girls/9.png'
import Girl10 from '../images/Girls/10.png'
import Girl11 from '../images/Girls/11.png'
import Girl12 from '../images/Girls/12.png'
import Girl13 from '../images/Girls/13.png'
import Girl14 from '../images/Girls/14.png'
import Girl15 from '../images/Girls/15.PNG'
import Girl16 from '../images/Girls/16.PNG'
import Girl17 from '../images/Girls/17.PNG'
import Girl18 from '../images/Girls/18.PNG'
import Girl19 from '../images/Girls/19.PNG'
import Girl20 from '../images/Girls/20.PNG'
import Girl21 from '../images/Girls/21.PNG'
import Girl22 from '../images/Girls/22.PNG'
import Girl23 from '../images/Girls/23.PNG'
import Girl24 from '../images/Girls/24.PNG'
import Girl25 from '../images/Girls/25.PNG'
import Girl26 from '../images/Girls/26.PNG'
import Girl27 from '../images/Girls/27.PNG'

import '../App.css'

function Gallery() {
    let girls =[Girl1, Girl2, Girl3, Girl4, Girl5, Girl6, Girl7, Girl8, Girl9, Girl10, Girl11, Girl12, Girl13,
        Girl14, Girl15, Girl16, Girl17, Girl18, Girl19, Girl20, Girl21, Girl22, Girl23, Girl24, Girl25, Girl26, Girl27]

    function renderGirls(){
        return(
            girls.map((girl,key)=>{
                return(
                    <Col className="d-flex align-items-center justify-content-center m-2">
                        <Card style={{ width: '18rem' }}
                        bg='dark'
                        text='light'>
                            <Card.Img variant="top" src={girl} />
                        </Card>
                    </Col>
                )
            })
        )
    }
    return ( 
        <Container>
            <Row>
                <Col className='m-5'>
                <h3><b>Meet some of our AI Girls</b></h3>
                <br/><div>You want to know their name? Mint them and decide.</div>
                </Col>
            </Row>
            <Row>
               {renderGirls()}
            </Row>
        </Container>
     );
}

export default Gallery;


