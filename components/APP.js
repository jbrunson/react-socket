//CLIENT SIDE
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var io = require('socket.io-client');
var Header = require('./parts/Header');

var APP = React.createClass({

  getInitialState() {
    return {
      status: 'disconnected',
      title: '',
      member: {},
      audience: []
    }
  },

  componentWillMount() {
    //listeners
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('welcome', this.welcome);
    this.socket.on('joined', this.joined);
    this.socket.on('audience', this.updateAudience);
  },

  emit(eventName, payload) {
    this.socket.emit(eventName, payload);
  },

  connect() {
    this.setState({ status: 'connected' });
  },

  disconnect() {
    this.setState({ status: 'disconnected' });
  },

  welcome(serverState) {
    this.setState({ title: serverState.title });
  },

  joined(member) {
    this.setState({ member: member });
  },

  updateAudience(newAudience) {
    this.setState({ audience: newAudience });
  },

  //Need to pass down All states w/spread operator **error
  render() {
    return (
      <div>
        <Header title={this.state.title} status={this.state.status} />
        {React.cloneElement(this.props.children, { title: this.state.title, 
                                                    status: this.state.status, 
                                                    emit: this.emit, 
                                                    member: this.state.member,
                                                    audience: this.state.audience })}
      </div>
    );
  }
});

module.exports = APP;