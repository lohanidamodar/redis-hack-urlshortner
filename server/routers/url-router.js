import { Router } from 'express'
import { urlRepository } from '../om/url.js'
import { v4 } from 'uuid'
import { connection as client } from '../om/client.js';
const PORT = process.env.port || 8000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

export const router = Router()

router.post('/urls/', async (req, res) => {
    let { originalUrl, shortName} = req.body

    try {
        if(shortName) {
            const existing = await urlRepository.search().where('shortName').eq(shortName).return.first()
            if(existing) {
                return res.status(409).send("This short URL is already taken, try another")
            }
        } else {
            while(true) {
                shortName = v4().substring(0, 6);
                const existing = await urlRepository.search().where('shortName').eq(shortName).return.first()
                if(!existing) break;
            }
        }
    
        const url = await urlRepository.createAndSave({
            originalUrl: originalUrl,
            shortName: shortName,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        client.ts.create(url.entityId)
        res.status(201).send({
            ...url,
            shortUrl: baseUrl + "/" + shortName
        })
    } catch(e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    const url = await urlRepository.search().where('shortName').eq(req.params.id).return.first();
    if(!url) {
        return res.status(404).send("URL not found");
    }
    client.ts.add(url.entityId, new Date().getTime(), 1)
    res.redirect(url.originalUrl)
})
