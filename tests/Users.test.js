const axios = require('axios')
const request = require('supertest');
const app = require('../app')

describe('UsersControllerTest', () => {
  it('Should get users data',async () => {
    const result = await request(app).get('/users')
    expect(result.status).toEqual(200)
  })

  it('Should get users data by ID', async () => {
    let userId = '1234567asdfgASDFG'
    const result = await request(app).get(`/users/${userId}`)
    expect (result.data.data._id).toEqual(userId)
  })

  it('Should handle user Login', async () => {
    let newUserData = {
      email: 'wahib.hanii@gmail.com',
      searchHistory: [],
    }
    const result = await request(app).post(`/users`, newUserData)
    expect (result.data.data._id).toEqual(userId)
  })

  it('Should update users', async () => {
    let userId = '1234567asdfgASDFG'
    let updatedData = {
      searchHistory : [{
        lat: 0,
        lng: 0,
        description: 'someplace',
      }]
    }
    const result = await request(app).put(`/users/${userId}`, )
    expect (result.data.data).toEqual(updatedData.searchHistory)
  })

  it('Should delete users', async () => {
    let userId = '1234567asdfgASDFG'
    const result = await request(app).delete(`/users/${userId}`)
    expect (result.data.data._id).toEqual(userId)
  }) 
})