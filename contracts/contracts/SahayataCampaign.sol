// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SahayataCampaign is Ownable, ReentrancyGuard {
    struct Milestone {
        string title;
        uint256 amount;
        bool released;
        string proofIpfsHash;
        uint256 approvalCount;
    }

    string public campaignName;
    string public description;
    uint256 public targetAmount;
    uint256 public raisedAmount;
    address public ngoAddress;
    
    Milestone[] public milestones;
    mapping(address => uint256) public donations;
    mapping(address => bool) public localVerifiers;
    uint256 public totalVerifiers;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event Donated(address indexed donor, uint256 amount);
    event ProofSubmitted(uint256 milestoneIndex, string proofHash);
    event MilestoneReleased(uint256 milestoneIndex, uint256 amount);
    event VoteCast(uint256 milestoneIndex, address indexed voter, bool approve);
    event VerifierAdded(address indexed verifier);

    constructor(
        string memory _name,
        string memory _description,
        uint256 _target,
        address _ngo,
        address _initialOwner
    ) Ownable(_initialOwner) {
        campaignName = _name;
        description = _description;
        targetAmount = _target;
        ngoAddress = _ngo;
    }

    function addVerifier(address _verifier) external onlyOwner {
        require(!localVerifiers[_verifier], "Already a verifier");
        localVerifiers[_verifier] = true;
        totalVerifiers++;
        emit VerifierAdded(_verifier);
    }

    function voteOnMilestone(uint256 _milestoneIndex, bool _approve) external {
        require(localVerifiers[msg.sender], "Only verifiers can vote");
        require(!hasVoted[_milestoneIndex][msg.sender], "Already voted");
        require(!milestones[_milestoneIndex].released, "Milestone already released");

        if (_approve) {
            milestones[_milestoneIndex].approvalCount++;
        }
        
        hasVoted[_milestoneIndex][msg.sender] = true;
        emit VoteCast(_milestoneIndex, msg.sender, _approve);
    }

    function donate() external payable {
        require(msg.value > 0, "Amount must be > 0");
        donations[msg.sender] += msg.value;
        raisedAmount += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    function addMilestone(string memory _title, uint256 _amount) external onlyOwner {
        milestones.push(Milestone({
            title: _title,
            amount: _amount,
            released: false,
            proofIpfsHash: "",
            approvalCount: 0
        }));
    }

    function submitProof(uint256 _milestoneIndex, string memory _proofHash) external {
        require(msg.sender == ngoAddress, "Only NGO can submit proof");
        require(!milestones[_milestoneIndex].released, "Already released");
        milestones[_milestoneIndex].proofIpfsHash = _proofHash;
        emit ProofSubmitted(_milestoneIndex, _proofHash);
    }

    function releaseMilestone(uint256 _milestoneIndex) external nonReentrant {
        Milestone storage m = milestones[_milestoneIndex];
        require(!m.released, "Already released");
        require(address(this).balance >= m.amount, "Insufficient balance");
        
        // Quorum Logic: 51% of verifiers must approve
        require(totalVerifiers > 0, "No verifiers registered");
        require(m.approvalCount * 2 > totalVerifiers, "Quorum not reached (need > 50%)");
        
        m.released = true;
        payable(ngoAddress).transfer(m.amount);
        emit MilestoneReleased(_milestoneIndex, m.amount);
    }

    receive() external payable {
        this.donate();
    }
}
