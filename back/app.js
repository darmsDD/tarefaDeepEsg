
const express = require('express')
const cors = require('cors');
const apiErrorHandler = require('./api-error-handler');
const bodyParser = require('body-parser');
const app = express()
const port = 9000
const axios = require('axios');
app.use(cors());
app.use(bodyParser.json())

var cont = 0;
var cidades = [];
var cidadeAtual;
app.get('/search/:city', function (req, res, next) {
  const { city } = req.params;
  cont+=1;
  axios.get(`https://api.hgbrasil.com/weather?fields=only_results,temp,city_name,humidity,wind_speedy&key=8d4f401b&city_name=${city}`)
    .then(response => {
        res.status(200).json(response.data);
        cidadeAtual = response.data
        
    })
    .catch(error => {
        next(error);
    });
    
})

app.get('/cities',function(req,res,next){
  res.status(200).json(cidades);
})

app.get('/citiesName',function(req,res,next){
  citiesName = [];
  cidades.forEach((lugar)=>{
    citiesName.push(lugar.city_name);
  });

  res.status(200).json(citiesName);
})

app.post('/save',function(req,res,next){
  
  if(isCityRepeated(cidadeAtual)){
    throw new Error("Cidade Já foi salva");
  } else if(cidades.length>=5){
    throw new Error("Limite de 5 cidades salvas atingido");
  }else if(cidadeAtual!=null){
    cidades.push(cidadeAtual);
  }
  res.status(204).send();
})

app.put('/deleteCity/',function(req,res,next){
  const {name} = req.body;
  cidades = cidades.filter((item) =>{
      let keepCity = true;
      name.forEach((cityName)=>{
        if(item.city_name === cityName){
          keepCity=false;
        }
      })
      return keepCity;
  })
  res.status(204).send();
})

function isCityRepeated(city){
  let isRepeatedCity=false;
  cidades.forEach((lugar)=>{
    if(lugar.city_name == city.city_name){
      isRepeatedCity=true;
    }
  });
  return isRepeatedCity?true:false;
   
}

app.use(apiErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

