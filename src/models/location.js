const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocSchema = new Schema({
    place:String,
    loc: {
        type: { type: String },
        coordinates: [],
    }
});
LocSchema.index( { loc: "2dsphere" } )
const Loc = mongoose.model('alocation',LocSchema);

module.exports = Loc;