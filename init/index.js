const mongoose = require('mongoose');
const listing = require('../model/listing.js');
const initData = require('./data.js'); 

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
.then(() =>{
    console.log("Connected Successfully");
}).catch((err) =>{
    console.log(err);
});


const intializeData = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "69a1763754cefae62696c2ff"}));
    await listing.insertMany(initData.data);
    console.log("Data Initialized Successfully");
}

intializeData();