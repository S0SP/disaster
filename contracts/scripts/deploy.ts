import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying SAHAYATA Protocol with account:", deployer.address);

    // 1. Deploy CampaignFactory
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    console.log("Deploying CampaignFactory...");
    const factory = await CampaignFactory.deploy();
    await factory.waitForDeployment();

    const factoryAddress = await factory.getAddress();
    console.log("CampaignFactory deployed to:", factoryAddress);

    // 2. Metadata (Optional for documentation)
    console.log("\n--- Deployment Summary ---");
    console.log("Network: ", (await ethers.provider.getNetwork()).name);
    console.log("Factory Address: ", factoryAddress);
    console.log("---------------------------\n");

    console.log("Post-deployment instructions:");
    console.log("1. Update 'lib/contracts.ts' with the new factory address.");
    console.log("2. NGOs can now create campaigns via the dashboard.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
