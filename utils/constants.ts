// Add your smart contract address here
export const CONTRACT_ADDRESS = "0x708d31AE513e4190dF4B1b52b18d03464E7B10C0";
// export const DAI_ADDRESS = "0x12e5d27fb5301f8a0fFf041C34B604fdE82a4A47";
export const DAI_ADDRESS = "0xD82d5a60A5E63B63A5975F8B9157d82A80059929";
// export const LDAO_ADRESS = "0xb91A02694deF8330DbC09C8660a3BCC5FD107069";
export const LDAO_ADRESS = "0x1B57Ce6ffaf6B59e64952eC8e9E43b1adF2023A3";

export const categories = [
  "Web3",
  "Frontend",
  "Backend",
  "NFT",
  "DeFi",
  "DAOs",
  "DevOps",
  "Blockchain",
  "EVM",
  "Ether.js",
  "Javascript",
  "Solidity",
  "Rust",
  "Go",
  "Non tech",
  "Solana",
  "Layer 2",
];

export const contentCategory = [
  "Tutorial",
  "Article",
  "Video",
  "Opensource Project",
];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export function abbreviateNumber(number) {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
}
