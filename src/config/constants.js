export const env = "dev"

const URLS = {
    live: "https://api.qbuygreen.com/public/api/",
    testing: "https://qbuygreenapi.diginestsolutions.in/public/api/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/api/"
}

const IMG_BASEPATH = {
    live: "https://api.qbuygreen.com/public/",
    testing: "https://qbuygreenapi.diginestsolutions.in/public/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/"
}

export const mode = "green"


export const BASE_URL = URLS[env]

export const IMG_URL = IMG_BASEPATH[env]

export const location = [8.5728749, 76.8636977];