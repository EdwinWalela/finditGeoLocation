const express = require('express');
const mongoose = require('mongoose');
var PORT =process.env.PORT || 3000;
const Loc = require('./models/location');
const app = express();


mongoose.connect(process.env.DB_URI)
.then(()=>console.log('connected to mongodb'));

app.listen(PORT,()=>console.log(`listening on port:${PORT}`))

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.post('/',(req,res)=>{
    let lon = parseFloat(req.body.lon);
    let lat = parseFloat(req.body.lat);
    let place = req.body.place

    const location = new Loc({ 
        "place":place,
        "loc": { 
            "type": "Point",
            "coordinates": [lon,lat]
        }//j
    }).save()
    .then(location=>{
        res.status(201).send('OK')
    })
    .catch(err=>{
        console.log(err)
        res.status(500).send(err)
    })
})

app.get('/?',(req,res)=>{
    let lon =  parseFloat(req.query.lon);
    let lat = parseFloat(req.query.lat);
    var point = {
        "type": "Point",
        "coordinates": [lon,lat]
      };
      //as
    Loc.aggregate(
        [{
            '$geoNear': {
                'near': point,
                'spherical': true,
                'distanceField': 'distance',
                'maxDistance': 1000000000000
            }
        },
        { "$sort": { "distance": -1}}],
        function(err,results) {
            res.send(results)
        }
    )
})
