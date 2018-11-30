# mongoose-dive-populate
A mongoose plugin to populate into nested documents in depth by a easy reading path.
The path can be specified by a url like:
"parent/children"

Can also select fields of population like:
"parent{name age}/children{name toy}"

Can limit the number of subdocuments in population
"parent{name age}/children[5]{name}"


# Usage

## Register plugin
```javascript
const divePopulate =require('mongoose-dive-populate')
mongoose.plugin(divePopulate)
```
or:
```javascript
YourSchema.plugin(divePopulate)
```

## population Example:

```javascript
const Club = mongoose.model('Club', new mongoose.Schema({
    name: String,
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    city: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }]
}))

const Player = mongoose.model('Player', new mongoose.Schema({
    name: String,
    age: number,
    goals: number,
    fans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }]
}))

const Fan = mongoose.model('Player', new mongoose.Schema({
    name: String
}))

Club.findOne({name: 'Barcelona'})
    .diveTo('players/fans')

// Can select fields
Club.findOne({name: 'Barcelona'})
    .diveTo('players{name}/fans')

// Can use with normal populate together 
Club.findOne({name: 'Barcelona'})
    .diveTo('players{name}/fans')
    .populate('city')

// Can select fields
Club.findOne({name: 'Barcelona'})
    .diveTo('players{name goals}/fans{name}')

// Can exclude fields
Club.findOne({name: 'Barcelona'})
    .diveTo('players{-age -goals}/fans{name}')
```

