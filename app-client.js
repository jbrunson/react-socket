var React = require('react');
var ReactDOM = require('react-dom');
// var Router = require('react-router');
// var Route = Router.Route;
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var IndexRoute = ReactRouter.IndexRoute;

var APP = require('./components/APP');
var Audience = require('./components/Audience');
var Speaker = require('./components/Speaker');
var Board = require('./components/Board');
// var Whoops404 = require('./components/Whoops404');
//not working in v1

var routes = (
  <Router>
    <Route path='/' component={APP}>
      <IndexRoute component={Audience} />
      <Route path="speaker" component={Speaker} />
      <Route path="board" component={Board} />
    </Route>
  </Router>
);

ReactDOM.render(<Router routes={routes}/>, document.getElementById("react-container"));

