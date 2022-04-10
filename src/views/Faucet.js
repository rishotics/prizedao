import React, { useEffect, useState } from 'react'

function Faucet({ ethWallet, daiContract }) {
    const [daiBalance, setDaiBalance] = useState('')

    useEffect(() => {
        if(daiContract) {
            getDaiBalance()
        }
    }, [daiContract])

    const getDaiBalance = async () => {
        const amount = await daiContract.balanceOf(ethWallet)
        console.log(amount.toString())
        setDaiBalance(amount.toString())
    }

    const mintDai = async () => {
       
    }

    return (
        <div className='container'>
            <div className='card mt-3'>
                <div className='card-body'>
                    <p>Your DAI balacne: {daiBalance} DAI</p>
                    <button className='btn btn-primary' onClick={mintDai}>
                        Get 10 DAI
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Faucet