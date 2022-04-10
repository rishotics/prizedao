// Add your smart contract address here

// PDAO GOVERNOR CONTRACT ADDRESS
export const GOVERNOR_CONTRACT_ADDRESS = "0xBEF154D930Cf37D9dDfedFf220249fE3014491CC";
// DAI_ADDRESS ;
export const DAI_ADDRESS = "0xF1C5dEBf9fEa50bf2D7DF859C514732b37b46f72";
// PDAO Token address
export const PDAO_ADRESS = "0x3CCe764C0A6518d7EA02823254C25E5dbBdb77c8";

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
