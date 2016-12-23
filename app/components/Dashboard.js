var React = require('react');
var FacebookActionCreators = require('../actions/FacebookActionCreators.js');

var Dashboard = React.createClass({

  didClickFacebookLogoutButton: function (e) {
      FacebookActionCreators.logout();
  },

  didClickGetPostsButton: function (e) {

    FacebookActionCreators.getFacebookPosts(this.props.userId);
  },

  didClickGetPhotosButton: function (e) {

    FacebookActionCreators.getFacebookPhotos(this.props.userId);
  },

  didClickGetFriendsButton: function (e) {
    FacebookActionCreators.getFacebookFriends(this.props.userId);
  },

	render: function () {

      var numLikes = this.props.totalLikes;
      var numPosts = this.props.totalPosts;
      var numFriends = this.props.totalFriends;
      return (
      	<div>
        	<button ref="logoutButton" onClick={this.didClickFacebookLogoutButton}>Log Out of Facebook</button>
          <button ref="getPostsButton" onClick={this.didClickGetPostsButton}>Get Posts</button>
          <button ref="getPhotosButton" onClick={this.didClickGetPhotosButton}>Get Photos</button>
          <button ref="getFriendsButton" onClick={this.didClickGetFriendsButton}>Get Friends</button>
          <p>Total likes = {numLikes}</p>
          <p>Average likes per post = {numPosts > 0 ? numLikes/numPosts : 0}</p>
          <p>Percentage of friends who like your posts, on average = {numFriends > 0 ? numLikes/numPosts/numFriends*100 : 0}%</p>
      	</div>
      );
  }
});

module.exports = Dashboard;