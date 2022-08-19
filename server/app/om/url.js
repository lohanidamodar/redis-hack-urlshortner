import { Entity, Schema } from 'redis-om'
import client from './client.js'

class Url extends Entity { }

const urlSchema = new Schema(Url, {
    originalUrl: { type: 'string' },
    shortName: { type: 'string' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
})

export const urlRepository = client.fetchRepository(urlSchema)

await urlRepository.createIndex()

