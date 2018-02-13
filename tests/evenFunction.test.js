const handle =  require('../src/handler')

describe('get event', () => {
  it('Should get users data', () => {
    const event = {
      field: "getEvents"
    }
    const context = {

    }
    const callback = (err, data) => {
      console.log(data)
    }
    handle.graphqlHandler(event,context,callback)
  })
})

