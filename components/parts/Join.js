var React = require('react');

var Join = React.createClass({

  join() {
    var memberName = React.findDOMNode(this.refs.name).value;
    this.props.emit('join', { name: memberName });
  },

  render() {
    return (
      <form action="javascript:void(0)" onSubmit={this.join}>
        <div className="col-xs-6">
          <label>Full Name</label>
          <input ref="name" className="form-control" placeholder="Enter your full name" required />
          <button className="btn btn-primary">Join</button>
        </div>
      </form>
    );
  }
});

module.exports = Join;