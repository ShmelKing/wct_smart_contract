// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract WCT is ERC721, PullPayment, Ownable {
    using Counters for Counters.Counter;

    // Constants
    uint256 public constant TOTAL_SUPPLY = 10_001;

    Counters.Counter private currentTokenId;

    /// @dev Base token URI used as a prefix by tokenURI().
    string public baseTokenURI;

    //  Worm Civilization Token - WCT
    constructor() ERC721("Worm Civilization", "WCT") {
        baseTokenURI = "";
    }

    function mintTo(address _to, uint count) public onlyOwner{
        uint256 tokenId = currentTokenId.current();
        require(tokenId + count < TOTAL_SUPPLY, "Max supply reached");
        for (uint i = 0; i < count; i++) {
            mintSingleNft(_to);
        }
    }

    function mintSingleNft(address _to) private{
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(_to, newItemId);
    }

    /// @dev Returns an URI for a given token ID
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /// @dev Sets the base token URI prefix.
    function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    /// @dev Overridden in order to make it an onlyOwner function
    function withdrawPayments(address payable payee) public override onlyOwner virtual {
        super.withdrawPayments(payee);
    }
}
