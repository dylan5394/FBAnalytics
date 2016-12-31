var React = require('react');

var TopFriends = React.createClass({



	render: function () {

		var firstIndex = this.props.topFriendsAverage[0];
		return (

			<div>
				{firstIndex ? <p>{firstIndex.name}: {firstIndex.likes}</p> : null}
			</div>
		);
	}
});

module.exports = TopFriends;