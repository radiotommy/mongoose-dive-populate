import divePopulate from './divePopulate.js'
import mongoose from 'mongoose'
import _ from 'lodash'


jest.setTimeout(3000)

describe('populate', () => {
  const ClubSchema = new mongoose.Schema({
    name: String,
    players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }]
  })

  const PlayerSchema = new mongoose.Schema({
    name: String,
    number: Number,
    fans: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fan'
    }]
  })

  const FanSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
  })

  let Club, Player, Fan

 beforeAll( async () => {
    await mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true})
    mongoose.plugin(divePopulate)
    
    Club = mongoose.model('Club', ClubSchema)
    Player = mongoose.model('Player', PlayerSchema)
    Fan = mongoose.model('Fan', FanSchema)

    const tom = await Fan.create({name: 'Tom', age: 20, email: 'tom@example.com'})
    const jerry = await Fan.create({name: 'Jerry', age: 30, email: 'jerry@example.com'})

    const messi = await Player.create({name: 'Messi', number: 10, fans: [tom._id, jerry._id]})
    const barcelona = await Club.create({name: 'Barcelona', players: [messi._id]})
  })

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.disconnect()
  })

  it('should has diveTo method pluged in', async () => {
    const barcelona = await Club.findOne({name: 'Barcelona'})
    expect(barcelona.diveTo).toBeDefined()
  })

  it('should be able to populate multipule levels and select all fields by default', async () => {
    const barcelona = await Club.findOne({name: 'Barcelona'})
    await barcelona.diveTo('players/fans').execPopulate()
    const obj = barcelona.toObject()

    expect(obj.players[0]).toEqual(expect.objectContaining({
      name: expect.any(String),
      number: expect.any(Number),
      fans: expect.anything()
    }))
    expect(obj.players[0].fans[0]).toEqual(expect.objectContaining({
      name: expect.any(String),
      age: expect.any(Number),
      email: expect.any(String)
    }))
  })

  it('should be able to select fields', async () => {
    const barcelona = await Club.findOne({name: 'Barcelona'})
    await barcelona.diveTo('players{name fans}/fans{email}').execPopulate()
    const obj = barcelona.toObject()

    expect(obj.players[0]).toEqual(expect.not.objectContaining({
      number: expect.anything()
    }))
    expect(obj.players[0]).toEqual(expect.objectContaining({
      name: expect.any(String)
    }))

    expect(obj.players[0].fans[0]).toEqual(expect.not.objectContaining({
      name: expect.any(String),
      age: expect.any(Number)
    }))

    expect(obj.players[0].fans[0]).toEqual(expect.objectContaining({
      email: expect.any(String)
    }))

    expect(obj.players[0].fans[1]).toEqual(expect.not.objectContaining({
      name: expect.any(String),
      age: expect.any(Number)
    }))
    expect(obj.players[0].fans[1]).toEqual(expect.objectContaining({
      email: expect.any(String)
    }))
  })

  it('should be able to exclude fields', async () => {
    const barcelona = await Club.findOne({name: 'Barcelona'})
    await barcelona.diveTo('players{-number -name}/fans{email}').execPopulate()
    const obj = barcelona.toObject()

    expect(obj.players[0]).toEqual(expect.not.objectContaining({
      number: expect.anything(),
      name: expect.anything(),
    }))

    expect(obj.players[0].fans[0]).toEqual(expect.not.objectContaining({
      name: expect.any(String),
      age: expect.any(Number)
    }))

    expect(obj.players[0].fans[0]).toEqual(expect.objectContaining({
      email: expect.any(String)
    }))

    expect(obj.players[0].fans[1]).toEqual(expect.not.objectContaining({
      name: expect.any(String),
      age: expect.any(Number)
    }))
    expect(obj.players[0].fans[1]).toEqual(expect.objectContaining({
      email: expect.any(String)
    }))
  })

  it('should be able to limit array length', async () => {
    const barcelona = await Club.findOne({name: 'Barcelona'})
    await barcelona.diveTo('players/fans[1]').execPopulate()
    const obj = barcelona.toObject()

    expect(obj.players[0].fans.length).toEqual(1)
  })

})
