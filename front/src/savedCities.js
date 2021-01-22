import React, { Component } from 'react';
import './savedCities.css';
import axios from 'axios';
import { Link } from 'react-router-dom'


class savedCities extends Component {
    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        this.state = { //state is by default an object
            city:[]
        }
    }

    renderTableHeader() {
        let header = ["cidade","temperatura","umidade","vento"];
        return header.map((key, index) => {
           return <th key={index}>{key.toUpperCase()}</th>
        })
    }
  
    componentDidMount() {
        axios.get(`http://localhost:9000/cities`)
          .then(res => {
            const city = res.data;
            this.setState({ city: city });
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

    renderTableData() {
        return this.state.city.map((city, index) => {
           const { temp, humidity, wind_speedy, city_name } = city //destructuring
           return (
              <tr key={index}>
                <td>{city_name}</td>
                 <td>{temp}</td>
                 <td>{humidity}</td>
                 <td>{wind_speedy}</td>
              </tr>
           )
        })
    }
  
    render() {
        return (
                <div>
                <h1 id='title'>Cidades Salvas</h1>
                <table id='students'>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                </table>
                <Link to="/">
                    <button>
                        <span>Voltar</span>
                    </button>
                </Link>
                </div>
        )
    }
 
    
      
}

export default savedCities //exporting a component make it reusable and this is the beauty of react


  