import axios from 'axios'
import { config } from 'dotenv'

const main = async () => {
    config()

    axios
        .get('https://api.deepdao.io/v0.1/organizations', {
            timeout: 10000,
            headers: {
                'x-api-key': process.env.DEEPDAO_API_KEY,
                accept: '*/*'
            }
        })
        .then((response) => {
            const data = response.data.data

            for (const res of data.resources) {
                console.log(res.name)
            }
        })
}

main()
