import React, { useState } from 'react'
import { NFTStorage, File } from 'nft.storage'

import { NFT_STRORAGE_APIKEY } from '../config'

const client = new NFTStorage({ token: NFT_STRORAGE_APIKEY })

function CreateTask() {
    const [name, setName] = useState('')
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
            setLoading(false);
        } catch(error) {
            console.error(error)
            setLoading(false)
        }
      }

    return (
        <div className="container">
            <div className="card card-body m-auto mt-4" style={{ maxWidth: "600px"}}>
                <h2>Create Task</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" rows="7" onChange={(e) => setDescription(e.target.value)}></textarea>
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