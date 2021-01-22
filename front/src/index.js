import React from 'react';
import ReactDOM from 'react-dom';
import savedCities from './savedCities';
import Busca from './Busca'

import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter>
        <Switch>
        <Route path="/cidadesSalvas" component={savedCities} />
        <Route path="/" exact={true} component={Busca} />
        </Switch>
    </BrowserRouter>,
  document.getElementById('root')
);