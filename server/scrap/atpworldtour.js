
Meteor.methods({
    'refreshRankingDates': function() {
        var url = 'http://www.atpworldtour.com/en/rankings/singles';
        HTTP.get(
            url,
            {
                params: {
                    rankRange: '0-0',
                    ajax:true
                }
            },
            function(err, result) {
                if (err || result.statusCode !== 200) {
                    console.log('HTTP call failed');
                    return;
                }
                $ = cheerio.load(result.content);
                $('ul[data-value=rankDate] > li[class=""]').each(function(i, item) {
                    var rankDate = moment(s.trim($(item).html()), 'YYYY.MM.DD').toDate();
                    RankingDates.upsert({rankDate: rankDate}, {rankDate: rankDate});
                });
            }
        );
    },
    'refreshRanking': function(rankDate, rankRange) {
        console.log('Refreshing men single rankings...');
        var url = 'http://www.atpworldtour.com/en/rankings/singles';
        var rankDateString = rankDate ? moment(rankDate).format('YYYY-MM-DD') : '2015-07-13';
        rankDate = rankDate || moment(rankDateString, 'YYYY-MM-DD').toDate();
        HTTP.get(
            url,
            {
                params: {
                    rankDate: rankDateString,
                    rankRange: rankRange || '1-500',
                    ajax:true
                }
            },
            function(err, result) {
                if (err || result.statusCode !== 200) {
                    console.log('HTTP call failed');
                    return;
                }
                $ = cheerio.load(result.content);
                //var _ = Meteor.npmRequire('underscore');  // force usage of underscore 1.8.3 from NPM for unzip
                var records = _.map(_.zip.apply(_, [
                    $('.rank-cell'),
                    $('.country-cell img'),
                    $('.player-cell'),
                    $('.points-cell')
                ]),function(arr) {
                    return {
                        'ranking': parseInt($(arr[0]).text()),
                        'country': $(arr[1]).attr('alt'),
                        'name': s.trim($(arr[2]).text()),
                        'points': parseInt($(arr[3]).text().replace(',', ''))
                    };
                });
                records.forEach(function(record) {
                    record.rankDate = rankDate;
                    MenSingles.upsert(record, record);
                });
            }
        );
    }
});
