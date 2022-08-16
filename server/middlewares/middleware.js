export let baseUrl = process.env.APP_BASE_URL

export const baseUrlMiddleware = (req, res, next) => {
    console.log(req)
    baseUrl = baseUrl.length > 0 ? baseUrl : req.protocol + "://" + req.hostname
    console.log(baseUrl)
    next()
}