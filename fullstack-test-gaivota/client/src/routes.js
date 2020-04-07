import React from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';

import Farms from './pages/farms';
import Farm from './pages/farm';
import Login from './pages/login';
import Buy from './pages/buy';

const Routes = () => (
   <BrowserRouter>
     <Switch>
       <Route exact path="/farms" component={Farms} />
       <Route exact path="/farm/:id?" component={Farm} />
       <Route exact path="/login" component={Login} />
       <Route exact path="/buy/:id/:bid" component={Buy} />
     </Switch>
   </BrowserRouter>
);

export default Routes;