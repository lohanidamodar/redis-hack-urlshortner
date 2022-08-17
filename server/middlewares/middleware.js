export let baseUrl = process.env.APP_BASE_URL

export const baseUrlMiddleware = (req, res, next) => {
    baseUrl = (baseUrl && baseUrl.length > 0) ? baseUrl : req.protocol + "://" + req.hostname
    next()
}