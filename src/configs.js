require('dotenv').config()

const config = {
    api: {
        port: process.env.PORT,
        uri: process.env.URI,
        default_page_count: process.env.DEFAULT_PAGE_COUNT,
    },
    aws:{
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.REGION
    },
    secret_key: process.env.SECRETPRIVATEKEY

}

module.exports = config