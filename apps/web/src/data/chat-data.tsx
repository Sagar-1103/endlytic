export interface Chat {
    id:string;
    role:"user"|"ai";
    timestamp:string;
    message: {
        text?:string;
        code?:{language:string,content:string,info:string};
        table?:string;
    }
}



export const exampleChat:Chat[] = [
    {
        id: "1",
        role: "user",
        message: {
            text:"Summarize the purpose of Kurabox APIs.",
        },
        timestamp: "2025-09-12T10:00:00Z",
    },
    {
        id: "2",
        role: "ai",
        message: {
            text:"Kurabox APIs allow developers to interact with a multi-chain wallet that supports Ethereum, Polygon, and Solana. Core functions include checking balances, retrieving account details, and sending transactions. These APIs provide a unified interface for wallet management across multiple blockchains.",
        },
        timestamp: "2025-09-12T10:00:05Z",
    },
    {
        id: "3",
        role: "user",
        message: {
            text:"What does the Getting Balance endpoint do?",
        },
        timestamp: "2025-09-12T10:01:00Z",
    },
    {
        id: "4",
        role: "ai",
        message: {
            text: "The `Getting Balance` endpoint retrieves the ETH balance for a specified wallet address on the Ethereum Sepolia testnet using the JSON-RPC method `eth_getBalance`.",
        },
        timestamp: "2025-09-12T10:01:10Z",
    },
    {
        id: "5",
        role: "user",
        message: {
            text: "Give me JavaScript code to call the Getting Balance endpoint.",
        },
        timestamp: "2025-09-12T10:02:00Z",
    },
    {
        id: "6",
        role: "ai",
        message: {
            text: "Here’s how to call the `Getting Balance` endpoint in JavaScript using Axios:",
            code: {
                language: "javascript",
                info:"",
                content: "const axios = require('axios');\n\nconst data = {\n  jsonrpc: \"2.0\",\n  id: 1,\n  method: \"eth_getBalance\",\n  params: [\"0x9229f570B55e5313c7414BcF833BFc9368fd244A\", \"latest\"]\n};\n\naxios.post(\"https://eth-sepolia.g.alchemy.com/v2/RKKihOFSM5ygtxh2q8RpNSHudhyhhwia\", data)\n  .then(res => console.log(res.data))\n  .catch(err => console.error(err));"
            },
        },
        timestamp: "2025-09-12T10:02:10Z",
    },
    {
        id: "7",
        role: "user",
        message: {
            text:"How do I send Solana from the wallet?",
        },
        timestamp: "2025-09-12T10:02:00Z",
    },
    {
        id: "8",
        role: "ai",
        message: {
            text: "To send Solana, call the `Send Solana` endpoint (`/wallet/send-solana`) with mode set to `devnet` and the Solana public key in the payload.",
            code: {
                language: "python",
                info:"",
                content: "import requests\n\nurl = \"http://localhost:3001/wallet/send-solana\"\npayload = {\n  \"mode\": \"devnet\",\n  \"tokens\": [\n    {\"chain\": \"solana\", \"publicKey\": \"HiRgP5293QiDPhytQoqjewmx6S3CF9TRQ22ZD6BQWyv6\"}\n  ]\n}\n\nres = requests.post(url, json=payload)\nprint(res.json())"
            },
        },
        timestamp: "2025-09-12T10:02:00Z",
    },
    // {
    //     id: "8",
    //     role: "ai",
    //     message: "You’re welcome! Would you like me to also explain useEffect?",
    //     timestamp: "2025-09-12T10:02:10Z",
    // },
    // {
    //     id: "9",
    //     role: "user",
    //     message: "How do I send Solana from the wallet?",
    //     timestamp: "2025-09-12T10:02:00Z",
    // },
    // {
    //     id: "10",
    //     role: "ai",
    //     message: "You’re welcome! Would you like me to also explain useEffect?",
    //     timestamp: "2025-09-12T10:02:10Z",
    // },
    // {
    //     id: "11",
    //     role: "user",
    //     message: "Compare Get Solana Info and Get ETH Info",
    //     timestamp: "2025-09-12T10:02:10Z",
    // },
];
