// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.13;

import "./AnastasisAct3.sol";
import "./IERC721.sol";
import "./IERC20.sol";

contract AnastasisLimitedEdition {

    uint256 public _price = 0.03 ether;

    address public _ashAddress= 0x64D91f12Ece7362F91A6f8E7940Cd55F05060b92;
    address public _fomoverseAddress = 0x74BB71a4210E33256885DEF483fD4227b7f9D88F;
    address public _anastasisAct2Address;
    address public _anastasisAct3Address;
    address private _recipient;
    address private _signer;

    bool public _fomoMintOpened;
    bool public _ashMintOpened;
    bool public _ALMintOpened;
    bool public _publicMintOpened;

    mapping (address => bool) public _isAdmin;
    mapping (address => bool) public _addressMintedInPublicSale;
    mapping (address => bool) public _addressMintedInPrivateSale;


    constructor(){
        _isAdmin[msg.sender] = true;
    }

    function approveAdmin(address newAdmin)external{
        require(_isAdmin[msg.sender]);
        _isAdmin[newAdmin] = true;
    }

    function removeAdmin(address exAdmin)external{
        require(_isAdmin[msg.sender]);
        _isAdmin[exAdmin] = false;
    }

    function setRecipient(address recipient) external {
        require(_isAdmin[msg.sender]);
        _recipient = recipient;
    }

    function setSigner (address signer) external{
        require(_isAdmin[msg.sender], "Only Admins can set signer");
        _signer = signer;
    }

    function setAshAddress(address ashAddress) external{
        require(_isAdmin[msg.sender]);
        _ashAddress = ashAddress;
    }

    function setAnastasisAct2Address(address anastasisAct2Address) external{
        require(_isAdmin[msg.sender]);
        _anastasisAct2Address = anastasisAct2Address;
    }

    function setAnastasisAct3Address(address anastasisAct3Address) external{
        require(_isAdmin[msg.sender]);
        _anastasisAct3Address = anastasisAct3Address;
    }

    function setFOMOAddress(address FOMOAddress) external{
        require(_isAdmin[msg.sender]);
        _fomoverseAddress = FOMOAddress;
    }

    function toggleFomoMintOpened()external{
        require(_isAdmin[msg.sender]);
        _fomoMintOpened = !_fomoMintOpened;
    }

    function toggleAshMintOpened()external{
        require(_isAdmin[msg.sender]);
        _ashMintOpened = !_ashMintOpened;
    }

    function toggleALMintOpened()external{
        require(_isAdmin[msg.sender]);
        _ALMintOpened = !_ALMintOpened;
    }

    function togglePublicMintOpened()external{
        require(_isAdmin[msg.sender]);
        _publicMintOpened = !_publicMintOpened;
    }

    function selectedByArtist( uint8 v, bytes32 r, bytes32 s)internal view returns(bool){
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
                                    _ALMintOpened,
                                    _addressMintedInPrivateSale[msg.sender] // should be false
                                )
                            )
                        )
                    )
                , v, r, s)
        );
    }

    function fomoHoldersMint()external payable{
        require(_fomoMintOpened, "Mint closed");
        require(IERC721(_fomoverseAddress).balanceOf(msg.sender)>= 1, "You aree not a FOMO holder");
        require(msg.value >= _price, "Not enough funds");
        require(!_addressMintedInPrivateSale[msg.sender], "Already Minted");
         bool success = payable(_recipient).send(_price);
        require(success, "Funds could not transfer");
        _addressMintedInPrivateSale[msg.sender] = true;
        Anastasis_Act3(_anastasisAct3Address).mint(msg.sender);
    }

    function ashHoldersMint()external payable{
        require(_ashMintOpened, "Mint closed");
        require(
            IERC721(_anastasisAct2Address).balanceOf(msg.sender)>= 1 &&
            IERC20(_ashAddress).balanceOf(msg.sender) >= 25*10**18
        );
        require(msg.value >= _price, "Not enough funds");
        require(!_addressMintedInPrivateSale[msg.sender], "Already Minted");
         bool success = payable(_recipient).send(_price);
        require(success, "Funds could not transfer");
        _addressMintedInPrivateSale[msg.sender] = true;
        Anastasis_Act3(_anastasisAct3Address).mint(msg.sender);
    }

    function selectedMint(
        uint8 v,
        bytes32 r, 
        bytes32 s
    )external payable{
        require(selectedByArtist(v, r, s));
        require(msg.value >= _price, "Not enough funds");
        bool success = payable(_recipient).send(_price);
        require(success, "Funds could not transfer");
        _addressMintedInPrivateSale[msg.sender] = true;
        Anastasis_Act3(_anastasisAct3Address).mint(msg.sender);
    }

    function publicMint() external payable{
        require(_publicMintOpened, "Mint closed");
        require(msg.value >= _price, "Not enough funds");
        require(!_addressMintedInPublicSale[msg.sender], "Already Minted");
        bool success = payable(_recipient).send(_price);
        require(success, "Funds could not transfer");
        _addressMintedInPublicSale[msg.sender] = true;
        Anastasis_Act3(_anastasisAct3Address).mint(msg.sender);
    }

}