
import { network } from "hardhat"

export async function moveBlocks(numOfBlocks: number){
    console.log("Moving blocks.... ")
    for (let i =0; i<= numOfBlocks; i++){
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
    console.log(` Blocks moved by ${numOfBlocks} `)
}