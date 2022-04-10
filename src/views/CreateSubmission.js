import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NFTStorage, File } from 'nft.storage'

import { NFT_STRORAGE_APIKEY } from '../config'

const client = new NFTStorage({ token: NFT_STRORAGE_APIKEY })

function CreateSubmission({ govContract }) {
    const { hackathonid, userid } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [githubURL, setGithubURL] = useState('')
    const [videoURL, setVideoURL] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [url, seturl] = useState('');

    const submitWork = async () => {
        try {
            setLoading(true)

            let files = [];
            files.push(new File(
                [JSON.stringify(
                {
                    name: name,
                    githubURL: githubURL,
                    videoURL: videoURL
                },
                null,
                3
                )], 'metadata.json')
            );

            const metadata = await client.storeDirectory(files);
            console.log(metadata)
            seturl(metadata)

            // uint256 _hackerId,
            // string memory _ipfsHash,
            // uint256 _hackathonId
            const transaction = await govContract.add_submission(userid, metadata, hackathonid)
            const tx = await transaction.wait()
            console.log(tx)
            navigate("/task/" + hackathonid)
            setLoading(false);
        } catch(error) {
            console.error(error)
            setLoading(false)
        }
      }

    return (
        <div className="container">
            <div className="card card-body m-auto mt-4" style={{ maxWidth: "600px"}}>
                <h2>Submit your work</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="github" className="form-label">Github Repo Link</label>
                    <input className="form-control" id="github" onChange={(e) => setGithubURL(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="video" className="form-label">Video Link</label>
                    <input className="form-control" id="video" onChange={(e) => setVideoURL(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Wallet Address</label>
                    <input className="form-control" id="address" onChange={(e) => setAddress(e.target.value)}/>
                </div>
                {!loading
                    ? <button className="btn btn-primary mb-3" onClick={submitWork} >
                        Submit
                    </button>
                    : <p>Loading...</p>
                }
                <p>{url}</p>
            </div>
    </div>
  )
}

export default CreateSubmission