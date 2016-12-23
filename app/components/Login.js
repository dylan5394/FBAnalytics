var FacebookActionCreators = require('../actions/FacebookActionCreators.js');
var React = require('react');

var FacebookLogin = React.createClass({
    
    didClickFacebookLoginButton: function (e) {
        FacebookActionCreators.login();
    },

    render: function () {
        return (
            <button ref="loginButton" onClick={this.didClickFacebookLoginButton}>Log Into Facebook</button>
        );
    }
});

module.exports = FacebookLogin;