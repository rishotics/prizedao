import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NFTStorage, File } from 'nft.storage'

import { NFT_STRORAGE_APIKEY } from '../config'

const client = new NFTStorage({ token: NFT_STRORAGE_APIKEY })

function CreateTask({ govContract }) {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [prize, setPrize] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [url, seturl] = useState('');

    const getImage = event => {
        const file = event.target.files[0]
        console.log(file)
        setImage(file)
      }

    const submitTask = async () => {
        try {
            setLoading(true)

            const imageFile = new File([ image ], image.name, { type: image.type })
            const metadata = await client.store({
                name: name,
                description: description,
                image: imageFile
            })

            console.log(metadata)
            seturl(metadata.url)

            // string memory _name, 
            // string memory _startDate,
            // string memory _endDate, 
            // uint _prizeMoney
            const transaction = await govContract.add_hackathon(metadata.url, "April 9", "April 20", (+prize * 10 ** 18).toString())
            const tx = await transaction.wait()
            console.log(tx)

            setLoading(false)
            navigate("/tasks")
        } catch(error) {
            console.error(error)
            setLoading(false)
        }
      }

    return (
        <div className="container">
            <div className="card card-body m-auto mt-4" style={{ maxWidth: "600px"}}>
                <h2>Create Bounty</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="prize" className="form-label">Prize Amount (MATIC)</label>
                    <input className="form-control" id="prize" onChange={(e) => setPrize(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <select className="form-select" aria-label="Default select example">
                        <option >Select Duration</option>
                        <option value="1">24 Hours</option>
                        <option value="2">48 Hours</option>
                        <option value="3">1 Mouth</option>
                        <option value="4">3 Mouths</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" rows="5" onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">
                        Add Image
                    </label>
                    <input className="form-control" type="file" id="formFileMultiple" onChange={getImage} />
                </div>
                {!loading
                    ? <button className="btn btn-primary mb-3"onClick={submitTask} >
                        Submit
                    </button>
                    : <p>Loading...</p>
                }
                <p>{url}</p>
            </div>
    </div>
  )
}

export default CreateTask