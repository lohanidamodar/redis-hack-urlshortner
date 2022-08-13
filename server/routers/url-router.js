import { Router } from 'express'
import { urlRepository } from '../om/url.js'
import { v4 } from 'uuid'
import { connection as client } from '../om/client.js';
const PORT = process.env.port || 8000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

export const router = Router()

const getUrls = async (req, res, next) => {
    if(req.params.shortName !== "urls")
        next()
    const urls = await urlRepository.search().return.all()
    res.send(urls)
}

const redirect = async (req, res) => {
    const url = await urlRepository.search().where('shortName').eq(req.params.shortName).return.first();
    if(!url) {
        return res.status(404).send("URL not found");
    }
    await client.ts.add(url.entityId, new Date().getTime(), 1)
    res.redirect(url.originalUrl)
}


router.get('/:shortName', [getUrls, redirect])

router.get('/urls/', async (req, res) => {
   
})

router.get('/urls/:id', async (req, res) => {
    const url = await urlRepository.fetch(req.params.id);
    if(!url)
        return res.status(404).send({error: "Requested resource not found"})
    return res.send({
        id: url.entityId,
        shortName: url.shortName,
        originalUrl: url.originalUrl,
        shortUrl: baseUrl + "/" + shortName,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
    })
})

router.post('/urls/', async (req, res) => {
    let { originalUrl, shortName} = req.body

    try {
        if(shortName) {
            if(shortName=='urls') {
                return res.status(403).send({error: 'urls is a reserved shortcut. Please try another'});
            }
            const existing = await urlRepository.search().where('shortName').eq(shortName).return.first()
            if(existing) {
                return res.status(409).send({error: "This short URL is already taken, try another"})
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
        await client.ts.create(url.entityId)
        res.status(201).send({
            id: url.entityId,
            shortName: url.shortName,
            originalUrl: url.originalUrl,
            shortUrl: baseUrl + "/" + shortName,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt,
        })
    } catch(e) {
        console.log(e)
        res.status(500).send("Server encountered an error")
    }
})

// router.get('/urls/:id/usage', async (req, res) => {
//     const url = await urlRepository.fetch(req.params.id);
//     if(!url)
//         return res.status(404).send({error: "Requested resource not found"})
    
//     try {
//         const data = await client.ts.range(req.params.id, new Date(url.createdAt), new Date(), {
//             AGGREGATION: "avg 3600000"
//         })
//     } catch(e) {
//         console.log(e)
//         res.status(500).send({error: 'Unexpected error'})
//     }
// })