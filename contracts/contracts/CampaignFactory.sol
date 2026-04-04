// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SahayataCampaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;
    event CampaignCreated(address indexed campaignAddress, string name, address indexed ngo);

    function createCampaign(
        string memory name,
        string memory description,
        uint256 targetAmount
    ) external {
        SahayataCampaign newCampaign = new SahayataCampaign(
            name,
            description,
            targetAmount,
            msg.sender, // NGO Address
            msg.sender  // Initial Owner
        );
        
        deployedCampaigns.push(address(newCampaign));
        emit CampaignCreated(address(newCampaign), name, msg.sender);
    }

    function getDeployedCampaigns() external view returns (address[] memory) {
        return deployedCampaigns;
    }
}
