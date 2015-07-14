
Meteor.publish("atp_men_singles_ranking", function (rankDate) {
    console.log('publish');
    console.log(rankDate);
    return MenSingles.find({rankDate:rankDate});
});

Meteor.publish("atp_men_singles_ranking_dates", function() {
    return RankingDates.find();
});
