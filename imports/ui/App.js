import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import moment from 'moment';

import { MenSingles, RankingDates } from '../api/collections.js';

import Pyramid from './visualizations/Pyramid.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {rankDate: null};
  }

  componentWillMount() {
    Meteor.call('refreshRankingDates');
  }

  onSelectDate(event) {
    const rankDate = moment(event.target.value, "DD.MM.YYYY").toDate();
    this.setState({
      rankDate
    })
    Meteor.call('refreshRanking', rankDate);
  }

  render() {
    return (
      <div>
        <Pyramid rankDate={this.state.rankDate}/>
        <select onChange={this.onSelectDate.bind(this)}>
        {this.props.options.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
        </select>
      </div>
    );
  }
}

App.propTypes = {
  options: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe("atp_men_singles_ranking");
  Meteor.subscribe("atp_men_singles_ranking_dates");
  return {
    options: RankingDates.find({}, {
      sort: {rankDate:-1},
      transform: function(doc) {
        doc.value = moment(doc.rankDate).format('DD.MM.YYYY');
        doc.label = moment(doc.rankDate).format('DD-MM-YYYY');
        return doc;
      }
    }).fetch()
  };
}, App);
