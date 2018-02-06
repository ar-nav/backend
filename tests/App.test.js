require('dotenv').config()
const { server } = require('../bin/www')


describe('App test' , () => {
  it('Should run on localhost', () => {
    expect(server.address().port).toEqual(3000)
  })
})