var React = require('react');

var TimePlot = require('./TimePlot');
var PeriodicalLine = require('./PeriodicalLine');
var TopFriends = require('./TopFriends');

import FacebookActionCreators from '../actions/FacebookActionCreators';
import FacebookStore from '../stores/FacebookStore';
import Login from './Login';
import Dashboard from './Dashboard';
import FacebookDownloadPicture from './FacebookDownloadPicture';
import FacebookPicture from './FacebookPicture';

var App = React.createClass({

  getFacebookState: function () {
        return {
            accessToken: FacebookStore.accessToken,
            loggedIn: FacebookStore.loggedIn,
            userId: FacebookStore.userId,
            facebookPictureStatus: FacebookStore.facebookPictureStatus,
            facebookPictureUrl: FacebookStore.facebookPictureUrl,

            totalFacebookPostLikes: FacebookStore.facebookPostLikes,
            totalFacebookPosts: FacebookStore.facebookPosts,

            facebookPhotos: FacebookStore.facebookPhotos,

            totalFacebookFriends: FacebookStore.facebookFriends,

            timePlotSeriesData: FacebookStore.timePlotSeries,

            periodicalLineData: FacebookStore.periodicalLineData,

            topFriendsAverage: FacebookStore.topFriendsAverage,
            topFriendsTotal: FacebookStore.topFriendsTotal
        }
  },

  getInitialState: function () {

    return this.getFacebookState();
  },

  componentDidMount: function () {
    FacebookActionCreators.initFacebook();
    FacebookStore.addChangeListener(() => this._onFacebookChange());
  },

  componentWillUnmount: function () {
    FacebookStore.removeChangeListener(this._onFacebookChange);
  },

  _onFacebookChange: function () {
    this.setState(this.getFacebookState());
  },

	render: function () {

			return (
				<div>
          {!this.state.loggedIn ? <Login /> : <Dashboard userId={this.state.userId} 
                                            totalLikes={this.state.totalFacebookPostLikes}
                                            totalPosts={this.state.totalFacebookPosts}
                                            totalFriends={this.state.totalFacebookFriends} />}
          <p>Facebook logged in: {this.state.loggedIn ? 'true' : 'false'}</p>

          {this.state.loggedIn ? <p>User ID is: {this.state.userId}</p> : null}
          {this.state.userId ? <FacebookDownloadPicture userId={this.state.userId} /> : null}
                
          <FacebookPicture
                facebookPictureStatus={this.state.facebookPictureStatus}
                facebookPictureUrl={this.state.facebookPictureUrl} />
          <TimePlot 
                seriesData={this.state.timePlotSeriesData} />
          <PeriodicalLine 
                seriesData={this.state.periodicalLineData} />
          <TopFriends 
                topFriendsAverage={this.state.topFriendsAverage}
                topFriendsTotal={this.state.topFriendsTotal} />
        </div>
			);
	 }
});

module.exports = App;