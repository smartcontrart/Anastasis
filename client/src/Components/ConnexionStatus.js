import React from "react";

function ConnexionStatus() {
        return(
            <React.Fragment>
            <span id='connexion_info'><small>Contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ACT3_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ACT3_ADDRESS}</a></b></small></span><br/>
            <span id='connexion_info'><small>Eth Minting contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ACT3MINT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ACT3MINT_ADDRESS}</a></b></small></span><br/>
            <span id='connexion_info'><small>Ash minting contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ACT3ASHMINT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ACT3ASHMINT_ADDRESS}</a></b></small></span>
            </React.Fragment>
        )
}

export default ConnexionStatus;