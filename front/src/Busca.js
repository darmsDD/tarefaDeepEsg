import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DataGrid } from '@material-ui/data-grid';

class Busca extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: '', 
            city: {
                city_name:'',
                temperature: '',
                humidity: '',
                wind_speedy: '',
            }, 
            cities: [],
            showCityInfo: false,
            isSaveButtonShowing: true,
            selected:[],
        };

        

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveCity = this.saveCity.bind(this);
        this.isCitySaved = this.isCitySaved.bind(this);
        this.deleteCity = this.deleteCity.bind(this);
    }
   
    handleChange(event) {
        this.setState({userInput: event.target.value});
      
    }
    handleSubmit(event) {
        event.preventDefault();
        let city_name = this.state.userInput;
            axios.get(`http://localhost:9000/search/${city_name}`)
            .then(res => {
                const city = res.data;
                this.setState({
                    city:{
                        city_name: city.city_name,
                        temperature: city.temp,
                        humidity:city.humidity,
                        wind_speedy:city.wind_speedy
                    }
                })
                this.isCitySaved(city);
            }).catch((error)=>{
                let message;
                if(error.response!==undefined){
                    let errorMessage1 = error.response.data;
                    let errorMessage2 = error.message;
                    message = (errorMessage1!==undefined)?errorMessage1.message : errorMessage2;
                } else {
                    message = error.message;
                }
                if(!alert(message)){
                    window.location.reload(); 
                }
                
               


            })
            event.target.value = null;
            this.setState({showCityInfo:true});
    }

    isCitySaved(city){
        let citySaved = false;
        this.state.cities.forEach((location)=>{
            if(location.city_name === city.city_name){
                this.setState({isSaveButtonShowing:false});
                citySaved=true;
            }
        })
        if(!citySaved){
            this.setState({isSaveButtonShowing:true});
        }

    }
    

    showCityInfo = () =>{
        const { temperature, humidity, wind_speedy, city_name } = this.state.city
        const listItems =  ( 
            <ul>
                <li>Nome: {city_name}</li>
                <li>Umidade: {humidity}%</li>
                <li>Vento: {wind_speedy}</li>
                <li>Temperatura: {temperature}ºC</li>
            </ul>
        );
        return(
            <div>
                {listItems}
                {this.state.isSaveButtonShowing
                    ? <button onClick={this.saveCity}> Salvar </button>
                    : <button onClick={this.saveCity} disabled> Salvar </button>}
            </div> 
        )
    }

    saveCity(){
        axios.post(`http://localhost:9000/save`)
        .then(res => {
            alert("Cidade salva com sucesso")
            //this.setState({cities:[...this.state.cities,this.state.city]});
            this.setState({isSaveButtonShowing:false});
            
            
        }).catch((error)=>{
          let message;
          if(error.response!==undefined){
              let errorMessage1 = error.response.data;
              let errorMessage2 = error.message;
              message = (errorMessage1!==undefined)?errorMessage1.message : errorMessage2;
          } else {
              console.log(error);
              message = error.message;
          }
          alert(message);
        })
    }


    componentDidMount() {
        axios.get(`http://localhost:9000/cities`)
          .then(res => {
            const city = res.data;
            this.setState({ cities: city });
          }).catch((error)=>{
            let message;
            if(error.response!==undefined){
                let errorMessage1 = error.response.data;
                let errorMessage2 = error.message;
                message = (errorMessage1!==undefined)?errorMessage1.message : errorMessage2;
            } else {
                message = error.message;
            }
            
            alert(message);
          })
    }

      
    DataTable() {

        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'nomeCidade', headerName: 'Nome Cidade', width: 150 },
            
        ];
        if(this.state.cities.length >=0){
            const rows =  this.state.cities.map((location, index) => {
                const {city_name} = location //destructuring
                return {id:index, nomeCidade:city_name};
            })
           
            return (
              <div style={{ height: 400, width: '50%', marginBottom:20 }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection 
                    onSelectionChange={(newSelection) => {
                        this.setState({selected:newSelection});
                    }}
                />
              </div>
            );
        }
    }

    deleteCity(){

        let deleteCities = {}
        deleteCities.name= this.state.selected.rowIds.map((selection)=>{
            return this.state.cities[selection].city_name;
        })

        axios.put(`http://localhost:9000/deleteCity`,deleteCities)
          .then(res => {
          }).catch((error)=>{
            let message;
            if(error.response!==undefined){
                let errorMessage1 = error.response.data;
                let errorMessage2 = error.message;
                message = (errorMessage1!==undefined)?errorMessage1.message : errorMessage2;
            } else {
                message = error.message;
            }
            
            alert(message);
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h1>Busca</h1>
                    <p>Digite o nome da cidade que está procurando</p>
                    <input type="text" value={this.state.userInput} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                {this.state.showCityInfo
                    ? this.showCityInfo()  
                    : <h5>Nenhuma cidade pesquisada ainda</h5>}

                {this.DataTable()}
                <Link to="/cidadesSalvas" >
                    <button>
                        <span>Comparar</span>
                    </button>
                </Link>
                <button onClick={this.deleteCity} style={{marginLeft:700}}>
                    <span>Deletar</span>
                </button>
            </div>
        );
 }
}
export default Busca;