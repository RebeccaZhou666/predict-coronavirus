const express = require('express');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const superagent= require('superagent');
const Datastore = require("nedb");
var app = express();

// careful when you point the path of the files in index.html, starts from public folder. not root folder!!!
app.use(express.static('public'));
app.use(express.json());

// three databases
const db = new Datastore({ filename: "coronavirus.db", autoload: true });
const db_est = new Datastore({ filename: "estimation.db", autoload: true });
const db_est_ave = new Datastore({ filename: "estimation_ave.db", autoload: true });
// first time to insert data in db.
// deletes everything in the database and create db files.
// db.remove({}, { multi: true }, function (err, numRemoved) {
//   const data = getData();

//   db.insert(data.coronavirus, function(err, entries) {
//     // console.log(entries);
//   });
// });


function getData_db(cb) {
  db.find({}).sort({"number":1}).exec(function(err,docs){ //need to exec to make it work!
    cb(err,docs);
  });
}


function getData_db_est_ave(cb) {
  db_est_ave.find({}).sort({"number":1}).exec(function(err,docs){ //need to exec to make it work!
    cb(err,docs);
  });
}

function updateData(newData) {
    db.update({time: newData.time}, {number:newData.number, time:newData.time});
}

function updateData_est_ave() {
    db_est_ave.update({time: tomorrow}, {number:ave_est, time:tomorrow});
}


let today_stats = []; 
let virusTotal = [];  
                   
let today = new Date();
let tomorrow = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+ (today.getDate()+1);

// fetch data from 1point3ares website
function crawlData(){
  superagent.get('https://coronavirus.1point3acres.com/en').end((err, res) => {
  if (err) {
    // error
    console.log(`Cannot get coronavirus data - ${err}`)
  } else {
    //parse and get info I want
    virusTotal = getCV(res); // current new 
    // console.log(getCV(res))
    updateData(virusTotal);
  }
  });
}

let stat;

function crawlStats(){
  superagent.get('https://coronavirus.1point3acres.com/en').end((err, res) => {
  if (err) {
  } else {
    stat = getStats(res); 
  }
  });
}


let getStats = (res) => {  
  let $ = cheerio.load(res.text);
  $('strong.jsx-889234990').each((idx, ele) => {
      if(idx < 3) today_stats.push(parseInt($(ele).text()));
    });
    console.log(today_stats)
    return today_stats;
};


let getCV = (res) => {
  let virus_T=[];
  let $ = cheerio.load(res.text);

  $('strong.jsx-889234990').each((idx, ele) => {
      let virus = {
        number: parseInt($(ele).text()),     
        time: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()  
      };
        virus_T.push(virus);
        // console.log(virus_T)
    });
    return virus_T[0];
};

let ave_est=0;
let population = 0;

function calculate(){
  db_est.find({time:tomorrow}, function(err,docs){
    ave_est = 0;
    docs.forEach(element => {
      ave_est += parseInt(element.estimation);
    });
    ave_est = Math.floor(ave_est/docs.length)
    population = docs.length;
  })
}

function insertNew(){
  db_est_ave.find({time:tomorrow}, function(err,docs){
    if(docs.length == 0){
      console.log("insert");
      db_est_ave.insert({number:ave_est, time:tomorrow});
    }else{
      updateData_est_ave();
    }
  })
}


// ---------------------- HTTP Communication -----------------

// auto update
app.get('/', function (req, res) {
  crawlData();
  calculate();
  res.sendFile(path.join(__dirname, "views/index.html"));
  });

// response for today's stats
app.get("/current", (req, res) => {
  crawlStats();
  res.json(today_stats);
});

// response for esti
app.get("/est", (req, res) => {
  calculate();
  updateData_est_ave();
  res.json([ave_est,population]);
});

// response for today's stats
app.get("/getChartData", (req, res) => {
  getData_db((err, data) => {
    res.json(data);
  });
});

// response for today's stats
app.get("/current_est", (req, res) => {
  getData_db_est_ave((err, data) => {
    res.json(data);
  });
});


app.post("/send", (req, res) => {
  // console.log(req);
  const new_est = {estimation: req.body.estimation, time:req.body.time};
  db_est.insert(new_est, function(err, entries) {
      console.log(entries);
      calculate();
  })
  insertNew();
  res.json(ave_est,population);
});



// function deleteTopping(toppingToDelete) {
//   const toppings = getToppings();
//   // filter does NOT change the original array
//   toppings.pizzaToppings = toppings.pizzaToppings.filter(topping => topping !== toppingToDelete);
//   fs.writeFileSync(path.join(__dirname, "./data/pizzaToppings.json"), JSON.stringify(toppings));
//   return toppings;
// }

// app.get("/toppings", (req, res) => {
//   const toppings = getToppings();
//     res.json(toppings);
//   });




// app.post("/toppings", (req, res)=>{
//   const topping = req.body.topping
//   toppings = addTopping(topping);
//   res.json({success: true});
// });


// app.delete("/toppings/:name", (req, res) => {
//   const toppingToDelete = req.params.name;
//   const toppings = deleteTopping(toppingToDelete);
//   res.json(toppings);
// });


// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views/index.html"));
// });



app.listen(8000);

