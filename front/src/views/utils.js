import { ethers } from 'ethers'

export const creating_hackathon = async(
    PrizeDAOGovernorContract,
    sponsor,
    hackathon_name,
    start_date,
    end_date,
    prize_money,
    token_address
  ) => {
    console.log('Sponsor creating a hackathon!!');
      const sponsor_address = await sponsor.getAddress();
      var txn = await PrizeDAOGovernorContract
                      .connect(sponsor)
                      .add_hackathon( 
                                  hackathon_name,
                                  start_date,
                                  end_date,
                                  prize_money, //PDAO tokens
                                  sponsor_address,
                                  token_address, {gasLimit: 1e7}
                        );
      var rc = await txn.wait();
      const event_hackathonCreated = rc.events.find(
            (event) => event.event === "HackathonCreated"
          );
      const [HackathonId] = event_hackathonCreated.args;
      console.log("NEW hackathon created with ID: ", HackathonId);
      return HackathonId;
  }


