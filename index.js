const express = require("express");
const app = express();
const server = require('http').createServer(app);
const dotenv = require("dotenv");
const csv = require('csv-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const { Parser } = require('json2csv');
app.use(express.json());

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded())


dotenv.config();
const cors=require('cors')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var csvWriter = require('csv-write-stream');
var writer = csvWriter({sendHeaders: false}); //Instantiate var
const updateddata={
  Name: 'Clair',
    Surname: 'balck',
    Age: 63,
    Gender: 'F',
}

const sampledata = [
  {
    name: 'John',
    surname: 'Snow',
    age: 26,
    gender: 'M'
  }, {
    name: 'Clair',
    surname: 'White',
    age: 33,
    gender: 'F',
  }, {
    name: 'Fancy',
    surname: 'Brown',
    age: 78,
    gender: 'F'
  }
];

function getCSVdata(){
  return new Promise((resolve,reject)=>{
  let d=[]
    fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      d.push(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      resolve(d)
    });
  })
}


app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin","http://localhost:4200"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  

  app.get('/readAll', (req, res) => {
    let d=[]
    fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      d.push(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      res.send(d)
    });
  });


  app.post('/write', async (req, res) => {
   
  writer = csvWriter({ headers: [
    { id: 'id', title: 'Id' },
      { id: 'name', title: 'Name' },
      { id: 'surname', title: 'Surname' },
      { id: 'age', title: 'Age' },
      { id: 'gender', title: 'Gender' }
  ]});

    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream('data.csv', {flags: 'a'}));
    if(writeObj(writer,req.body)){
      let d=await getCSVdata()
      res.send({message:'success',data:d});

    }
    writer.end();
  });

//   app.post('/delete', async(req, res) => {
//     console.log("deletinggggggg")
//     let data=await getCSVdata()
//     let upf=data.filter(e=>e.Id!=req.body.Id)
//    const iid = upf.map((e) => {
//     return { 
//       id:e.Id,
//       name: e.Name ,
//       surname:e.Surname,
//       age:e.Age,
//       gender:e.Gender
//     };
//   });

//   const csvWriter = createObjectCsvWriter({
//     path: 'data.csv',
//     header: [
//       { id: 'id', title: 'Id' },
//         { id: 'name', title: 'Name' },
//         { id: 'surname', title: 'Surname' },
//         { id: 'age', title: 'Age' },
//         { id: 'gender', title: 'Gender' }
//         // Add more header objects if needed for additional fields
//     ]
// });
// console.log("")

// csvWriter.writeRecords(iid)
//     .then(() => {
//         console.log('CSV file has been written successfully');
//         res.send("record is deleted successfullly")
//     })
//     .catch((error) => {
//         console.error('Error writing CSV file:', error);
// });
//   });
app.delete('/delete/:id',async(req,res)=>{
  console.log("deleting")
  console.log(req.params.id)
    let data=await getCSVdata()
    let upf=data.filter(e=>e.Id!=req.params.id)
   const iid = upf.map((e) => {
    return { 
      id:e.Id,
      name: e.Name ,
      surname:e.Surname,
      age:e.Age,
      gender:e.Gender
    };
  });

  const csvWriter = createObjectCsvWriter({
    path: 'data.csv',
    header: [
      { id: 'id', title: 'Id' },
        { id: 'name', title: 'Name' },
        { id: 'surname', title: 'Surname' },
        { id: 'age', title: 'Age' },
        { id: 'gender', title: 'Gender' }
        // Add more header objects if needed for additional fields
    ]
});
console.log("")

csvWriter.writeRecords(iid)
    .then(async() => {
      let d=await getCSVdata()
      res.send({message:'success',data:d});
        console.log('CSV file has been written successfully');
        res.send({message:"record is deleted successfullly",data:d})
    })
    .catch((error) => {
        console.error('Error writing CSV file:', error);
});
})

  app.get('/get/:id', (req, res) => {
   let readstream= fs.createReadStream('data.csv')
    readstream.on('error', () => {
    })
    readstream.pipe(csv()).on('data', (row) => {
        console.log(row);
        if (row.Id === req.params.id) {
          stopreading = true; // Set the flag to stop readingr
          const { Id, ...rest } = row;

          res.send(rest)
          readstream.destroy()
        }
    })
    readstream.on('end', () => {
    })
  });


  app.post('/update', async(req, res) => {
    let data=await getCSVdata()
    let index=data.findIndex(e=>e.Id==req.body.id)
    data[index].Name=req.body.name
    data[index].Age=req.body.age
    data[index].Surname=req.body.surname
    data[index].Gender=req.body.gender
    const iid = data.map((e) => {
      return { 
        id:e.Id,
        name: e.Name ,
        surname:e.Surname,
        age:e.Age,
        gender:e.Gender
      };
    });

    const csvWriter = createObjectCsvWriter({
      path: 'data.csv',
      header: [
        { id: 'id', title: 'Id' },
          { id: 'name', title: 'Name' },
          { id: 'surname', title: 'Surname' },
          { id: 'age', title: 'Age' },
          { id: 'gender', title: 'Gender' }
      ]
  });

  csvWriter.writeRecords(iid)
      .then(() => {
          console.log('CSV file has been written successfully');
          res.send('CSV file has been updated successfully')
      })
      .catch((error) => {
          console.error('Error writing CSV file:', error);
  });

});

  function writeObj(csvwriter,data){
    if(!csvwriter.write(data))
    return new Promise(resolve => csvwriter.once('drain', resolve))
   return true;

  }

server.listen(8800,function(){
    console.log("connected")
  
  })