# URL Shortener with Node.JS and Redis

A URL shortener application build with ExpressJS, Redis and SvelteKit. Shorten URLs and also get link visit history.

[Live Demo](https://urlui.vercel.app)

## Screenshots

![image](https://user-images.githubusercontent.com/6360216/185554653-0db5bb38-f744-4e7c-9fbb-bdc91df8598d.png)

![image](https://user-images.githubusercontent.com/6360216/185554679-860051b6-734b-42f6-b0b4-039613537236.png)

![image](https://user-images.githubusercontent.com/6360216/185554696-f3ae20d7-d385-4c0b-8784-0d0271ec0464.png)


## Overview video (Optional)

Here's a short video that explains the project and how it uses Redis:

[![Embed your YouTube video](https://i.ytimg.com/vi/vyxdC1qK4NE/maxresdefault.jpg)](https://www.youtube.com/watch?v=vyxdC1qK4NE)

## How it works

![Architecture Diagram](https://user-images.githubusercontent.com/6360216/185571798-01d76032-e03a-4852-bb84-005a243183ca.png)


### How the data is stored:

The project uses redis json to store Url records. Each record has following properties

- originalUrl: string
- shortName: string
- createdAt: date
- updatedAt: date

To easily work with redis project uses [Redis OM for Node.js](https://github.com/redis/redis-om-node).

1. Schema definition

    ```js
    // server/app/om/url.js
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
    ```

2. Add new Url record

    When app receives a request to create new record, it validates the request and then creates the record using urlRepository as the following

    ```js
    // server/app/routers/url-router.js
    router.post('/urls/', async (req, res) => {
        // validate request confirm the shortName is available
        // also generate short if not provided
        ...
        const url = await urlRepository.createAndSave({
            originalUrl: originalUrl,
            shortName: shortName,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        ...
    }
    ```

    The project also uses RedisTimeSeries to store the usage data for the Urls. Three different time series are created for each Url record.

    ```js
    // server/app/routers/url-router.js

    router.post('/urls/', async (req, res) => {
        ...
        // Timeseries to store data every time a URL is hit, that is retained
        // for 28 hours and is used to generate hourly usage chart for Url
        await client.ts.create(url.entityId, {
            RETENTION: 28 * 60 * 60 * 1000,
        })

        // Timeseries to aggregate the above data calculating the sum of all
        // the hits every hour and is retained for 33 days.
        // It is used to display the daily usage chart for Url
        await client.ts.create(url.entityId+":hourly", {
            RETENTION: 33 * 24 * 60 * 60 * 1000,
        })

        // Rule to aggregate hourly data and store it 
        await client.ts.createRule(url.entityId, url.entityId+":hourly", "SUM", 3600000)

        // Time series to incrementally keep the record of total hits, retained
        // indefinitely
        await client.ts.create(url.entityId+":hits")
        ...
    }
    ```

    And every time a shortcut is used, these metrics gets collected as the following

    ```js
    // server/app/routers/url-router.js -> redirect
    ...
    // Realtime hits data
    await client.ts.add(url.entityId, new Date().getTime(), 1)

    // Total hits always incremented
    await client.ts.incrBy(url.entityId + ":hits", 1)
    ...
    ```


### How the data is accessed:

1. Redirect to Url when short name is provided

    We search the Url repository using the given short name and if the record is found and exists, we use the originalLink present in the record to redirect

    ```js
    // server/app/routers/url-router.js
    
    const redirect = async (req, res) => {
        // search by shortName and return the first match
        const url = await urlRepository.search().where('shortName').eq(req.params.shortName).return.first();
        
        // throw 404 if record is not found
        if(!url) {
            return res.status(404).send("URL not found");
        }

        // Update Timeseries if record is found
        await client.ts.add(url.entityId, new Date().getTime(), 1)
        await client.ts.incrBy(url.entityId + ":hits", 1)

        // redirect to the originalUrl
        res.redirect(url.originalUrl)
    }
    ```

2. Get history of all the short Urls created

    We return all the records using the search on urlRepository.

    ```js
    // server/app/routers/url-router.js
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
    ```

2. Get hourly/daily metrics of a Url

    The hourly metrics is recrived from the realtime timeseries data, aggregating hourly during the request as the following

    ```js
    router.get('/urls/:id/usage', async (req, res) => {
        // fetch URL using the repository
        const url = await urlRepository.fetch(req.params.id);

        // throw error if it doesn't exist
        ...
        
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

            // Fily empty dataset with 0s
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

            // Also get total hits
            const hits = await client.ts.get(url.entityId+":hits")

            res.send({
                usage: usage,
                hits: hits?.value ?? 0,
                url: {
                    id: url.entityId,
                    shortName: url.shortName,
                    originalUrl: url.originalUrl,
                    shortUrl: baseUrl + "/" + url.shortName,
                    createdAt: url.createdAt,
                    updatedAt: url.updatedAt,
                }
            })
        } catch(e) {
            console.log(e)
            res.status(500).send({error: 'Unexpected error'})
        }
    })
    ```

    To retrieve the daily usage we use the exact same workflow, however we use the hourly timeseries and aggregate for every day during the request like we aggregate for every hour above.


## How to run it locally?

### Prerequisites

- [Node.JS](https://nodejs.org) - v16.16.0
- [Docker](https://docker.com) - v20.10.17


### Local installation


First, clone the repository from github

```
git clone https://github.com/lohanidamodar/redis-hack-urlshortner
```

#### Running the server

1. Go to `redis-hack-urlshortner/server`

    ```bash
    # Go to server folder
    cd redis-hack-urlshortner/server

    # environment variables
    cp .env.example .env

    # run the server stack
    docker compose up -d
    ```

2. View logs to verify the server is running

    ```
    docker compose logs app
    ```

    And you should see the output similar to the following.

    ```
    server-app-1  | Server started at 8000
    ```

#### Running the Client

1. Go to the client directory and install dependencies

    ```bash
    # Go to client directory
    cd redis-hack-urlshortner/client

    # install dependencies
    npm install
    ```

2. Copy the default .env.example as .env

    ```bash
    cp .env.example .env
    ```

2. Run the dev script to start the development server

    ```bash
    npm run dev
    ```

    You should see the output similar to the following.

    ```
    VITE v3.0.8  ready in 722 ms

    ➜  Local:   http://127.0.0.1:5173/
    ➜  Network: use --host to expose
    ```

3. Visit the provided link in your browser, you should see the home page

## Deployment

To make deploys work, you need to create free account on [Redis Cloud](https://redis.info/try-free-dev-to)

### Vercel

- Server 
    
    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flohanidamodar%2Fredis-hack-urlshortner%2Ftree%2Fmain%2Fserver&env=APP_PORT,APP_REDIS_URL,APP_BASE_URL&project-name=urlshortener&repo-name=urlshortener-server&redirect-url=https%3A%2F%2Fgithub.com%2Flohanidamodar%2Fredis-hack-urlshortner)

- Client

    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flohanidamodar%2Fredis-hack-urlshortner%2Ftree%2Fmain%2Fclient&env=APP_SERVER_BASE_URL&project-name=urlshortener-client&repo-name=urlshortener-client&redirect-url=https%3A%2F%2Fgithub.com%2Flohanidamodar%2Fredis-hack-urlshortner)


### Let's get connected:

[![youtube](https://img.shields.io/badge/youtube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/reactbits)
[![devto](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white)](https://dev.to/lohanidamodar)
[![twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/lohanidamodar)
[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lohanidamodar/)


## More Information about Redis Stack

Here some resources to help you quickly get started using Redis Stack. If you still have questions, feel free to ask them in the [Redis Discord](https://discord.gg/redis) or on [Twitter](https://twitter.com/redisinc).

### Getting Started

1. Sign up for a [free Redis Cloud account using this link](https://redis.info/try-free-dev-to) and use the [Redis Stack database in the cloud](https://developer.redis.com/create/rediscloud).
1. Based on the language/framework you want to use, you will find the following client libraries:
    - [Redis OM .NET (C#)](https://github.com/redis/redis-om-dotnet)
        - Watch this [getting started video](https://www.youtube.com/watch?v=ZHPXKrJCYNA)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-dotnet/)
    - [Redis OM Node (JS)](https://github.com/redis/redis-om-node)
        - Watch this [getting started video](https://www.youtube.com/watch?v=KUfufrwpBkM)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-node/)
    - [Redis OM Python](https://github.com/redis/redis-om-python)
        - Watch this [getting started video](https://www.youtube.com/watch?v=PPT1FElAS84)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-python/)
    - [Redis OM Spring (Java)](https://github.com/redis/redis-om-spring)
        - Watch this [getting started video](https://www.youtube.com/watch?v=YhQX8pHy3hk)
        - Follow this [getting started guide](https://redis.io/docs/stack/get-started/tutorials/stack-spring/)

The above videos and guides should be enough to get you started in your desired language/framework. From there you can expand and develop your app. Use the resources below to help guide you further:

1. [Developer Hub](https://redis.info/devhub) - The main developer page for Redis, where you can find information on building using Redis with sample projects, guides, and tutorials.
1. [Redis Stack getting started page](https://redis.io/docs/stack/) - Lists all the Redis Stack features. From there you can find relevant docs and tutorials for all the capabilities of Redis Stack.
1. [Redis Rediscover](https://redis.com/rediscover/) - Provides use-cases for Redis as well as real-world examples and educational material
1. [RedisInsight - Desktop GUI tool](https://redis.info/redisinsight) - Use this to connect to Redis to visually see the data. It also has a CLI inside it that lets you send Redis CLI commands. It also has a profiler so you can see commands that are run on your Redis instance in real-time
1. Youtube Videos
    - [Official Redis Youtube channel](https://redis.info/youtube)
    - [Redis Stack videos](https://www.youtube.com/watch?v=LaiQFZ5bXaM&list=PL83Wfqi-zYZFIQyTMUU6X7rPW2kVV-Ppb) - Help you get started modeling data, using Redis OM, and exploring Redis Stack
    - [Redis Stack Real-Time Stock App](https://www.youtube.com/watch?v=mUNFvyrsl8Q) from Ahmad Bazzi
    - [Build a Fullstack Next.js app](https://www.youtube.com/watch?v=DOIWQddRD5M) with Fireship.io
    - [Microservices with Redis Course](https://www.youtube.com/watch?v=Cy9fAvsXGZA) by Scalable Scripts on freeCodeCamp
