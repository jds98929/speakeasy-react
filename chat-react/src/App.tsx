import * as React from 'react';
import * as io from 'socket.io-client';
import './App.css';
import './include/bootstrap';
import { AppNav } from './components/nav/nav.component';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomeComponent } from './components/home/home.component';
import { UsernameComponent } from './components/username/username.component';

class App extends React.Component {

  public socket = io.connect('http://ec2-3-16-31-253.us-east-2.compute.amazonaws.com:8080');

  public render() {
    return (
      <BrowserRouter>
        <div>
          <AppNav />
          <div id="main-content-container">
            <Switch>
              <Route path="/username" render={(props) => <UsernameComponent {...props} socket={this.socket}/>} />
              <Route path="/home" render={(props) => <HomeComponent {...props} socket={this.socket}/>} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
