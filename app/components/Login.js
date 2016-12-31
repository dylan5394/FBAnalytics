var FacebookActionCreators = require('../actions/FacebookActionCreators.js');
var React = require('react');

var FacebookLogin = React.createClass({
    
    didClickFacebookLoginButton: function (e) {
        FacebookActionCreators.login();
    },

    render: function () {
        return (
        	<div>
            	<button ref="loginButton" onClick={this.didClickFacebookLoginButton}>Log Into Facebook</button>
  			</div>
        );
    }
});

module.exports = FacebookLogin;