import { createThirdwebClient } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export const chain = polygonAmoy;

export const wallets = [
    inAppWallet({
        auth: {
            options: ["google", "email", "apple", "facebook"],
        },
        smartAccount: {
            chain: polygonAmoy,
            sponsorGas: true,
        },
    }),
];

