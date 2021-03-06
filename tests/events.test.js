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

  it('Should error get users data', () => {
    http.post('/', { mutation:`
    {
      createEvent{
        ID
        name
      }
    }` 
  }).then(data => {
      expect(data).toBeNull()
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })

  it('Should error get users data', () => {
    http.post('/', { mutation:`
    {
      createEvent(ID:"283283"){
        ID
        name
      }
    }` 
  }).then(data => {
      expect(data).toBeNull()
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
  it('Should error get users data', () => {
    http.post('/', { mutation:`
    {
      createEvent(name:"test"){
        ID
        name
      }
    }` 
  }).then(data => {
      expect(data).toBeNull()
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })

  it('Should create Event data', () => {
    http.post('/', { mutation:`
    {
      createEvent(input:"testing"){
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

  it('Should delete Event data', () => {
    http.post('/', { mutation:`
    {
      deleteEvent(ID:"283283"){
        ID
      }
    }` 
  }).then(data => {
        expect(data.status).toEqual(200)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })

  it('Should delete Event data', () => {
    http.post('/', { mutation:`
    {
      deleteEvent{
        ID
      }
    }` 
  }).then(data => {
        expect(data).toBeNull()
    }).catch(err => {
      expect(err).not.toBeNull()
    })
  })
  
})


  