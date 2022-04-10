// Add your smart contract address here

// PDAO GOVERNOR CONTRACT ADDRESS
export const GOVERNOR_CONTRACT_ADDRESS = "0xA2E0716dEF6989361C3Ac6d2f83fE16d12e63d9f";
// DAI_ADDRESS ;
export const DAI_ADDRESS = "0x057A2D2C37989028B3029fA355cD32b39f3d83E8";
// PDAO Token address
export const PDAO_ADRESS = "0x8fdd6499C0B5b2fD518EC9808C6e76be806C1aE0";

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
