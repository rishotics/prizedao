import { ethers } from 'ethers'

export const creating_hackathon = async(
    PrizeDAOGovernorContract,
    sponsor,
    hackathon_name,
    start_date,
    end_date,
    prize_money,
    token_address,
    sponsorAddress
  ) => {
      console.log('Sponsor creating a hackathon!!');
      console.log(`Name: ${hackathon_name} prize_money: ${prize_money} sponsor: ${sponsorAddress} pdao_add: ${token_address}`);
      var txn = await PrizeDAOGovernorContract
                      .add_hackathon( 
                                  hackathon_name,
                                  start_date,
                                  end_date,
                                  prize_money, //PDAO tokens
                                  sponsorAddress,
                                  token_address, {from: sponsorAddress ,gasLimit: 1e7}
                        );
      var rc = await txn.wait();
      const event_hackathonCreated = rc.events.find(
            (event) => event.event === "HackathonCreated"
          );
      const [HackathonId] = event_hackathonCreated.args;
      console.log("NEW hackathon created with ID: ", HackathonId);
      return HackathonId;
  }


