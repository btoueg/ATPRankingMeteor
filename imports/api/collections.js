import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const MenSingles = new Mongo.Collection('atp_men_singles_ranking');
const RankingDates = new Mongo.Collection('atp_men_singles_ranking_dates');

if (Meteor.isServer) {
  Meteor.publish("atp_men_singles_ranking", function (rankDate) {
    console.log(`publish ranking for ${rankDate}`);
    return MenSingles.find({rankDate});
  });

  Meteor.publish("atp_men_singles_ranking_dates", function() {
    return RankingDates.find();
  });
}

export {
  MenSingles,
  RankingDates,
};
