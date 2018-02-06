const axios = require('axios')
const request = require('supertest');
const app = require('../app')

describe('AdssControllerTest', () => {
  it('Should get advertisements data',async () => {
    const result = await request(app).get('/advertisements')
    expect(result.status).toEqual(200)
  })

  it('Should get advertisements data by ID', async () => {
    let advertisementId = '1234567asdfgASDFG'
    const result = await request(app).get(`/advertisements/${advertisementId}`)
    expect (result.data.data._id).toEqual(advertisementId)
  })

  it('Should create advertisement', async () => {
    let newAdsData = {
      description: 'Iklan',
      urlToAsset: 'url',
      lat: 0,
      lng: 0,
      radius: 5
    }
    const result = await request(app).post(`/advertisements`, newAdsData)
    expect (result.data.data._id).toEqual(advertisementId)
  })

  it('Should update advertisements', async () => {
    let advertisementId = '1234567asdfgASDFG'
    let updatedData = {
      description: 'Iklan-edited',
      urlToAsset: 'urledit',
      lat: 1,
      lng: 1,
      radius: 6
    }
    const result = await request(app).put(`/advertisements/${advertisementId}`, )
    expect (result.data.data).toEqual(updatedData)
  })

  it('Should delete advertisements', async () => {
    let advertisementId = '1234567asdfgASDFG'
    const result = await request(app).delete(`/advertisements/${advertisementId}`)
    expect (result.data.data._id).toEqual(advertisementId)
  }) 



})