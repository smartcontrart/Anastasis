// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.13;

import "erc721a/contracts/ERC721A.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "@manifoldxyz/libraries-solidity/contracts/access/AdminControl.sol";
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import '@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract Anastasis_Act2 is ERC721A, AdminControl, VRFV2WrapperConsumerBase, ConfirmedOwner {
    
    address payable  private _royalties_recipient;
    uint256 private _royaltyAmount; //in % 
    uint256 public _tokenId = 0;
    string public _uri;
    
    mapping(uint256 => uint256) public _tokenURIs;

    // VRF Config
        event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords, uint256 payment);

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 2;

    // Address LINK - hardcoded for Goerli
    address linkAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;

    // address WRAPPER - hardcoded for Goerli
    address wrapperAddress = 0x708701a1DfF4f478de54383E49a627eD4852C816;

    
    constructor (uint64 subscriptionId) 
        ERC721A("f-1 Anastasis - Act2", "f-1 AA2") 
        ConfirmedOwner(msg.sender) 
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {
        _royalties_recipient = payable(msg.sender);
        _royaltyAmount = 10;
    } 

    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, AdminControl)
        returns (bool)
    {
        return
        AdminControl.supportsInterface(interfaceId) ||
        ERC721A.supportsInterface(interfaceId) ||
        interfaceId == type(IEIP2981).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    function requestRandomWords() external onlyOwner returns (uint256 requestId) {
        requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function mint( 
        address to,
        uint256 quantity
    ) external adminRequired{
        for(uint256 i=0; i < quantity; i++){
            uint256 rarity = getPseudoRandomNumber(100);
            uint256 uri;
            if(rarity < 5){
                uri = getPseudoRandomNumber(2) + 1;
            }else if(rarity < 22){
                uri = getPseudoRandomNumber(5) + 3;
            }else{
                uri = getPseudoRandomNumber(7) + 8;
            }
            _tokenURIs[_tokenId] = uri;
            _tokenId += 1;
        }
        _mint(to, quantity);
    }

    function getPseudoRandomNumber(uint256 length) public view returns (uint256){    
        uint256 rnd = uint256(keccak256(abi.encodePacked(block.timestamp, _tokenId)));
        return rnd % length;
    }

    function burn(uint256 tokenId) public {
        address owner = ERC721A.ownerOf(tokenId);
        require(msg.sender == owner, "Owner only");
        _burn(tokenId);
    }

    function setURI(
        string calldata updatedURI
    ) external adminRequired{
        _uri = updatedURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_uri, Strings.toString(_tokenURIs[tokenId]), ".json"));
    }

    function setRoyalties(address payable _recipient, uint256 _royaltyPerCent) external adminRequired {
        _royalties_recipient = _recipient;
        _royaltyAmount = _royaltyPerCent;
    }

    function royaltyInfo(uint256 salePrice) external view returns (address, uint256) {
        if(_royalties_recipient != address(0)){
            return (_royalties_recipient, (salePrice * _royaltyAmount) / 100 );
        }
        return (address(0), 0);
    }

    function withdraw(address recipient) external adminRequired {
        payable(recipient).transfer(address(this).balance);
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }


}