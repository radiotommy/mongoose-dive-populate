# mongoose-dive-populate
A mongoose plugin to populate into nested documents in depth by a easy reading path

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

## population

