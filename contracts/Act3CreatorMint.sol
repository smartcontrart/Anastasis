// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.13;

import "./AnastasisAct3.sol";
import "./FundSplit.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AnastasisCreatorMint {

    address public _anastasisAct3Address= 0xD6D0C1A49E83DF2F4Cb6b711ba915A8f05bC04f9;
    address private _signer;

    bool public _mintOpened;

    mapping (address => bool) _isAdmin;
    mapping (address => bool) public _hasMinted;

    constructor(){
        _isAdmin[msg.sender] = true;
    }

    function setAnastasisAct3Address(address anastasisAct3Address) external{
        require(_isAdmin[msg.sender]);
        _anastasisAct3Address = anastasisAct3Address;
    }

    function toggleAdmin(address newAdmin)external{
        require(_isAdmin[msg.sender]);
        _isAdmin[newAdmin] = !_isAdmin[newAdmin];
    }
    
    function toggleMintOpened()external{
        require(_isAdmin[msg.sender]);
        _mintOpened = !_mintOpened;
    }

    function setSigner (address signer) external{
        require(_isAdmin[msg.sender], "Only Admins can set signer");
        _signer = signer;
    }

    function mintAllowed( uint8 v, bytes32 r, bytes32 s)internal view returns(bool){
        return(
            _signer ==
                ecrecover(
                    keccak256(
                        abi.encodePacked(
                            "\x19Ethereum Signed Message:\n32",
                            keccak256(
                                abi.encodePacked(
                                    msg.sender,
                                    _anastasisAct3Address,
                                    _mintOpened,
                                    _hasMinted[msg.sender] // should be false
                                )
                            )
                        )
                    )
                , v, r, s)
        );
    }


    function getFreeMint(
        uint8 v,
        bytes32 r, 
        bytes32 s
    )external{
        require(mintAllowed(v, r, s), "Mint not allowed");
        Anastasis_Act3(_anastasisAct3Address).mint(msg.sender);
        _hasMinted[msg.sender] = true;
    }

}