
Template.body.helpers({
    options: RankingDates.find({}, {
        sort: {rankDate:-1},
        transform: function(doc) {
            doc.value = moment(doc.rankDate).format('DD.MM.YYYY');
            doc.label = moment(doc.rankDate).format('DD-MM-YYYY');
            return doc;
        }
    })
});

Template.body.events({
    'change select': function(evt) {
        Session.set('rankDate', moment(evt.target.value, "DD.MM.YYYY").toDate())
    }
});

Meteor.startup(function () {

    Meteor.subscribe("atp_men_singles_ranking");
    Meteor.subscribe("atp_men_singles_ranking_dates");

    Deps.autorun(function(){
        // change subscription
        Meteor.subscribe("atp_men_singles_ranking", Session.get('rankDate'));
        // make sure we have the data scraped
        Meteor.call('refreshRanking', Session.get('rankDate'));
    })
});
