// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MediaPlayer is ERC721 {
    
    address payable  private _royalties_recipient;

    uint256 private _royaltyAmount; //in % 
    uint256 public _channelCounter;
    uint256 public _activeChannel;


    string[] private _uriComponents;
    string public _offImage;

    bool public _mediaIsOn;

    struct Channel{
        string description;
        string image;
        string media;
        uint256 length;
        address owner;
    }

    mapping(uint256 => Channel) _channels;
    mapping (address => bool) public _isAdmin;
    mapping (address => uint256 []) _channelsOwned;

    constructor () ERC721("f-1 Anastasis - Act1", "f-1 AA1") {
        _uriComponents = [
            'data:application/json;utf8,{"name":"',
            '", "description":"',
            '", "created_by":"f-collective", "image":"',
            '", "image_url":"',
            '", "animation":"',
            '", "animation_url":"',
            '"}'];
        _isAdmin[msg.sender] = true;
        _royalties_recipient = payable(msg.sender);
        _royaltyAmount = 10;
        _channelCounter = 1;
    } 

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        return
        ERC721.supportsInterface(interfaceId) ||
        interfaceId == type(IEIP2981).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    modifier adminRequired{
        require(_isAdmin[msg.sender], "You are not an admin");
        _;
    }

    function mint( 
        address to
    ) external adminRequired{
        require(!_exists(1), "Only 1 token can be created with this contract");
        _mint(to, 1);
    }

    function play(uint256 channel) external{
        require(!_mediaIsOn, 'already playing');
        _activeChannel = channel;
        _mediaIsOn = true;
    }

    function burn(uint256 tokenId) public {
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender == owner, "Owner only");
        _burn(tokenId);
    }

    function toggleAdmin(address admin)external adminRequired{
        _isAdmin[admin] = !_isAdmin[admin] ;
    }

    function setOffImage(
        string calldata updatedOffImage
    ) external adminRequired{
        _offImage = updatedOffImage;
    }

    function createChannel(
        string calldata description,
        string calldata image,
        string calldata media,
        uint256 length
    ) external adminRequired{
        Channel memory channel;
        channel.description = description;
        channel.image = image;
        channel.media = media;
        channel.length = length;
        channel.owner = msg.sender;
        _channels[_channelCounter] = channel;
        _channelsOwned[msg.sender].push(_channelCounter);
        _channelCounter ++;
    }

    function getMedia(
        string memory description,
        string memory image,
        string memory media
    )internal view returns (string memory){
        bytes memory byteString = abi.encodePacked(
            abi.encodePacked(_uriComponents[0], "f-collective media player"),
            abi.encodePacked(_uriComponents[1], description),
            abi.encodePacked(_uriComponents[2], image),
            abi.encodePacked(_uriComponents[3], image),
            abi.encodePacked(_uriComponents[4], media),
            abi.encodePacked(_uriComponents[5], media),
            abi.encodePacked(_uriComponents[6])
        );
        return string(byteString);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        if(_mediaIsOn){
            Channel memory channel = _channels[_activeChannel];
            return getMedia(
                channel.description,
                channel.image,
                channel.media
            );
        }else{
            return getMedia(
                'Pending transmition',
                _offImage,
                ''
            );
        }
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

}