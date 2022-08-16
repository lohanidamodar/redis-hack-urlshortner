import { Router } from 'express'
import { urlRepository } from '../om/url.js'
import { v4 } from 'uuid'
import { connection as client } from '../om/client.js'
import { baseUrl } from '../middlewares/middleware.js'

const PORT = process.env.APP_PORT || 8000;

export const router = Router()

const getUrls = async (req, res, next) => {
    if(req.params.shortName === "urls") {
        let urls = await urlRepository.search().return.all()
        urls = urls.map((url) => ({
            id: url.entityId,
            shortName: url.shortName,
            originalUrl: url.originalUrl,
            shortUrl: baseUrl + "/" + url.shortName,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        }))
        return res.send(urls)
    }
    next()
}

const redirect = async (req, res) => {
    const url = await urlRepository.search().where('shortName').eq(req.params.shortName).return.first();
    if(!url) {
        return res.status(404).send("URL not found");
    }
    await client.ts.add(url.entityId, new Date().getTime(), 1)
    await client.ts.incrBy(url.entityId + ":hits", 1)
    res.redirect(url.originalUrl)
}

router.get('/', (req, res) => {
    res.json({'developersAreAwesome': true});
})

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
        shortUrl: (baseUrl ?? (req.protocol + "://" + req.hostname)) + "/" + url.shortName,
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
        await client.ts.create(url.entityId, {
            RETENTION: 28 * 60 * 60 * 1000,
        })
        await client.ts.create(url.entityId+":hourly", {
            RETENTION: 33 * 24 * 60 * 60 * 1000,
        })
        
        //keep the total hits for lifetime
        await client.ts.create(url.entityId+":hits")

        await client.ts.createRule(url.entityId, url.entityId+":hourly", "SUM", 3600000)
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

router.get('/urls/:id/usage', async (req, res) => {
    const url = await urlRepository.fetch(req.params.id);
    if(!url)
        return res.status(404).send({error: "Requested resource not found"})
    
    try {
        
        let from = Math.min(url.createdAt, new Date().getTime() - 24 * 3600000);
        
        // normalize to hour
        from = Math.floor(from / 3600000) * 3600000;
        const to = Math.ceil(new Date() / 3600000) * 3600000;

        const data = await client.ts.range(url.entityId, from, to, {
            AGGREGATION: {
                type: "SUM",
                timeBucket: 60 * 60 * 1000
            }
        })

        const hours = [];
        for(let i = from; i <= to; i += 3600000) {
            hours.push(new Date(i))
        }
        const usage = hours.map((hour) => {
            const hourData = data.find((d) => d.timestamp == hour.getTime())
            return {
                datetime: hour.toString(),
                timestamp: hour.getTime(),
                value: hourData ? hourData.value : 0
            }
        });


        res.send(usage)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: 'Unexpected error'})
    }
})

router.get('/urls/:id/usage/daily', async (req, res) => {
    const url = await urlRepository.fetch(req.params.id);
    if(!url)
        return res.status(404).send({error: "Requested resource not found"})
    
    try {
        
        let from = Math.min(url.createdAt, new Date().getTime() - 30 * 24 * 3600000);
        from = new Date(from).setUTCHours(0,0,0,0);
        const to = new Date().setUTCHours(0,0,0,0);

        const data = await client.ts.range(url.entityId + ":hourly", from, to, {
            AGGREGATION: {
                type: "SUM",
                timeBucket: 24 * 60 * 60 * 1000
            }
        })

        const hours = [];
        for(let i = from; i <= to; i += 24 * 3600000) {
            hours.push(new Date(i))
        }
        const usage = hours.map((hour) => {
            const hourData = data.find((d) => d.timestamp == hour.getTime())
            return {
                datetime: hour.toString(),
                timestamp: hour.getTime(),
                value: hourData ? hourData.value : 0
            }
        });


        res.send(usage)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: 'Unexpected error'})
    }
})

router.get('/urls/:id/hits', async (req, res) => {
    const url = await urlRepository.fetch(req.params.id);
    if(!url)
        return res.status(404).send({error: "Requested resource not found"})
    
    try {
        const data = await client.ts.get(url.entityId+":hits")
        res.send(data)
    } catch(e) {
        console.log(e)
        res.status(500).send({error: 'Unexpected error'})
    }
})