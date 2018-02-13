import { error } from 'util';

const axios = require('axios')

const http = axios.create({
    baseURL: "https://ael3l4ewpbffzmehxdpvxlfigm.appsync-api.us-east-1.amazonaws.com/graphql",
    headers: {"x-api-key": "da2-arau223jmbbiddhflcebwwxhuq"}
})

describe('get event', () => {
  it('Should get users data', () => {
    http.post('/', { query:`
    {
      getPlaces {
        ID
        name
      }
    }` 
  }).then(data => {
        console.log
        expect(data.status).toEqual(500)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
})