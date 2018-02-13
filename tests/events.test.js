const axios = require('axios')

const http = axios.create({
    baseURL: "https://ael3l4ewpbffzmehxdpvxlfigm.appsync-api.us-east-1.amazonaws.com/graphql",
    headers: {"x-api-key": "da2-arau223jmbbiddhflcebwwxhuq"}
})

describe('get event', () => {
  it('Should get users data', () => {
    http.post('/', { query:`
    {
      getEvents {
        ID
        name
      }
    }` 
  }).then(data => {
        expect(data.status).toEqual(200)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
})

