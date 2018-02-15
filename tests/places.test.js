const axios = require('axios')

const http = axios.create({
    baseURL: "https://ael3l4ewpbffzmehxdpvxlfigm.appsync-api.us-east-1.amazonaws.com/graphql",
    headers: {"x-api-key": "da2-arau223jmbbiddhflcebwwxhuq"}
})

const getID = null

describe('testing place', () => {
  it('Should get All place data', () => {
    http.post('/', { query:`
    {
      getAllPlaces{
        ID
        name
        longitude
        latitude
        event {
          ID
          name
        }
      }
    }` 
  }).then(data => {
        expect(data.status).toEqual(200)
        expect(data.data.getPlace).toMatchObject();
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
  it('Should get place tanpa id data', () => {
    http.post('/', { query:`
    {
      getPlace{
        ID
        name
        longitude
        latitude
        event {
          ID
          name
        }
      }
    }` 
  }).then(data => {
        expect(data).toBeNull()
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
  it('Should get place data', () => {
    http.post('/', { query:`
    {
      getPlace(ID: "e7709210-10a6-11e8-91aa-f5d444aa6838"){
        ID
        name
        longitude
        latitude
        event {
          ID
          name
        }
      }
    }` 
  }).then(data => {
        expect(data.status).toEqual(200)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })

  it('Should create Place data', () => {
    http.post('/', { mutation:`
    {
    createPlace(input: {
        name: "testing",
        latitude: "2382392",
        longitude: "273623",
        eventId: "testing"
    }) 
      {
        name
        longitude
        latitude
      }
    }` 
  }).then(data => {
        console.log(data)
        getID = data.data.ID
        expect(data.status).toEqual(200)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })
  it('Should create Place data', () => {
    http.post('/', { mutation:`
    {
    createPlace(input: {
        name: "testing",
        latitude: "2382392",
        longitude: "273623"
    }) 
      {
        name
        longitude
        latitude
      }
    }` 
  }).then(data => {
        expect(data.status).toEqual(200)
    }).catch(err => {
      expect(err.response).toEqual(undefined)
    })
  })

  it('Should delete Places data', () => {
    http.post('/', { mutation:`
    {
      deletePlace(ID:${getID}){
        ID
      }
    }` 
  }).then(data => {
        expect(data).not.toBeNull()
    }).catch(err => {
      expect(err).not.toBeNull()
    })
  })

  it('Should err delete Places data', () => {
    http.post('/', { mutation:`
    {
      deletePlace{
        ID
      }
    }` 
  }).then(data => {
        expect(data).not.toBeNull()
    }).catch(err => {
      expect(err).not.toBeNull()
    })
  })
  
})

