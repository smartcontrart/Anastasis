import React from "react";
import {Container, Row, Card, Col} from 'react-bootstrap'
import aafren from '../images/profilePictures/aafren.jpeg'
import amyjsmith from '../images/profilePictures/amyjsmith.jpeg'
import bitsavage from '../images/profilePictures/bitsavage.jpeg'
import chank from '../images/profilePictures/chank.jpeg'
import thedigitalcoy from '../images/profilePictures/thedigitalcoy.jpeg'
import smartcontrart from '../images/profilePictures/smartcontrart.jpeg'
import superjohn from '../images/profilePictures/superjohn.jpeg'
import hypnotoad from '../images/profilePictures/hypnotoad.jpeg'
import oqum from '../images/profilePictures/oqum.jpeg'
import mhx from '../images/profilePictures/mhx.jpeg'
import noleaz from '../images/profilePictures/noleaz.jpeg'
import makeitrad from '../images/profilePictures/makeitrad.jpeg'
import simply from '../images/profilePictures/simply.jpeg'
import tardis from '../images/profilePictures/tardis.jpeg'
import davida from '../images/profilePictures/davida.jpeg'
import brand from '../images/profilePictures/brand.jpeg'
import offedge from '../images/profilePictures/offedge.jpeg'
import austin from '../images/profilePictures/austin.jpg'
import iseult from '../images/profilePictures/iseult.jpeg'


import '../App.css'

function Team() {


    const collective = [
        {name: "aa.fren", image: aafren, description: "🪞 'ironic things are interesting'", twitter_link: "https://twitter.com/aa_fren"},
        {name: "AmyJSmithLA", image: amyjsmith, description: "📸  Capture the light, capture the moment, and then write it all out.✖", twitter_link: "https://twitter.com/AmyJSmithLA"},
        {name: "BitSavage", image: bitsavage, description: "Misoem - ‘f’ value since 2017", twitter_link: "https://twitter.com/PhenomenalMark"},
        {name: "BRAND", image: brand, description: "Web3 architect. Exploring non-physical form and space. Collector of fine nfts", twitter_link: "https://twitter.com/poet_2796"},
        {name: "chank diesel", image: chank, description: "font designer & alphabet artist.", twitter_link: "https://twitter.com/chankfonts"},
        {name: "David Ariew", image: davida, description: "3D NFT Artist and C4D / Octane Educator", twitter_link: "https://twitter.com/DavidAriew"},
        {name: "HypnoToad", image: hypnotoad, description: "Not an actual toad | 'F' Collective | Brümhodla | Disco Inferno | Misc. Cartoons |", twitter_link: "https://twitter.com/JohnMFnBrown"},
        {name: "makeitrad", image: makeitrad, description: "Artist, designer, pixel manipulator. Looking at the world with childlike wonder. 🤍 ", twitter_link: "https://twitter.com/makeitrad1"},
        {name: "MHX", image: mhx, description: "Creator of @Zen_Blocks. mhx.eth", twitter_link: "https://twitter.com/MhxAlt"},
        {name: "Noleaz", image: noleaz, description: "Photographer / Digital Art. My goal is to photograph every major city and meet people who admire  my art", twitter_link: "https://twitter.com/noealz"},
        {name: "OQUM", image: oqum, description: "Mattia Celli aka OQUM 𓆣 Photographer | Conceptual Artist | Collector", twitter_link: "https://twitter.com/oqum_"},
        {name: "SuperJohn", image: superjohn, description: "ASH/PAK Community Resources", twitter_link: "https://twitter.com/JohnMFnBrown"},
        {name: "Simply Anders", image: simply, description: "3D Artist Pak Fomo", twitter_link: "https://twitter.com/liquidmarbles"},
        {name: "Tardis_Yoda", image: tardis, description: "#NFTs for 🆙💫. 🔲1/1 Smartist on digital painting and photography 🌌 Art is my toy.® $ETH #WeAcceptAsh  $ASH 🎸F Collective💢 $APE", twitter_link: "https://twitter.com/Tardis_Yoda"},
        {name: "TheDigitalCoy", image: thedigitalcoy, description: "👁create & 👁collect on #ETH & @tezos(so far), audiovisual poet, @ARTNationX, #WeAcceptAsh, 'F'Fam", twitter_link: "https://twitter.com/TheDigitalCoy"},
        {name: "Smart Contrart", image: smartcontrart, description: "Code is art. Smart contract a new medium. Contract breaker, NFT builder. Helping artists make their vision a reality", twitter_link: "https://twitter.com/SmartContrart"},
        {name: "OffEdge", image: offedge, description: "family; host of @Web3w_me; key contributor @beansdaowtf; partner to Pak F#777; ", twitter_link: "https://twitter.com/Zach_French_"},
        {name: "Austin Hambelton", image: austin, description: "Sales Professional at @FordMotorCity / Radio Show Host @FomoverseRadio 🔶 📻 🎷F #937 & #413 / Check out my show 👇🏻 $BTC $ETH $ASH", twitter_link: "https://twitter.com/AustinHambelton"},
        {name: "iseult", image: iseult, description: "IMPAKT | Eternal Pak Supporter - Creator - Collector & Educator", twitter_link: "https://twitter.com/_seult"},
    ]

    function renderCards(){
        return(
            <Row className='project_row' xs={12}>
                {collective.map((profile,idx)=>{
                    return(
                        <Col className='project_col d-flex justify-content-center my-3' key={idx} xs='12' md='6' lg='4'>
                            <Card className='project_card'>
                            <a href={profile.twitter_link} target="_blank" rel="noopener noreferrer"    >
                                <Card.Img className='card_image' variant="top" src={profile.image}/>
                            </a>
                                <Card.Body className='card_body'>
                                <a href={profile.twitter_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none'}}>
                                    <Card.Title className={`card_title grow`} style={{color: 'black', fontWeight: 'bold'}}>{profile.name}</Card.Title>
                                </a>
                                    <Card.Text className={`card_text`}>
                                        <div style={{color: 'black'}}className='mb-3'>
                                            {profile.description}
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        )
    }

    return ( 
        <Container fluid>
            <Row className="d-flex align-items-center my-5">
                <h1><b>f-1 Anastasis - The Team</b></h1>
            </Row>
            <Row>
                <div className="mb-5"><b>The ‘F-Collective’ is a grass-roots initiative which has spawned from the very depths of Pak’s Discord server. It is a community of creators, collectors, & like-minded individuals building for an interesting 'f'uture.</b></div>
                <div className="mb-5">Please meet the members of the f-collective</div>
            </Row>
            <Row>
                {renderCards()}
            </Row>
        </Container>
     );
}

export default Team;


