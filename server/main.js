
Meteor.startup(function () {
    cheerio = Meteor.npmRequire('cheerio');

    Meteor.call('refreshRankingDates')
});
