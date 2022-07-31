import React from 'react'

import HeroImg from '../assets/hero-img.jpeg'

function Home() {
    return(
        <div className="home">
            <div className="container py-6">
                <div className="row gx-7">
                    <div className='col-sm-10 col-md-6 mt-5'>
                        <h1 className='h2 mt-5'>
                            ABCDEDS
                        </h1>
                        <button className='btn btn-info btn-lg mt-3'>
                            Learn More
                        </button>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <img src={HeroImg} className='img-fluid' alt="Home Img" />
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Home