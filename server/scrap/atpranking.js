
Meteor.methods({
    'ranking': function() {
        var url = 'http://www.atpworldtour.com/en/rankings/singles';
        HTTP.get(
            url,
            {
                params: {
                    rankDate: '2015-07-13',
                    rankRange:'1-500',
                    ajax:true
                }
            }, function(err, result) {
            if (result.statusCode == 200) {
                $ = cheerio.load(result.content);
                var result = _.map(_.zip.apply(
                    _,
                    [
                        $('#singlesRanking .rank-cell'),
                        $('#singlesRanking .country-cell img'),
                        $('#singlesRanking .player-cell'),
                        $('#singlesRanking .points-cell')
                    ]
                ),function(arr) {
                    return {
                        'ranking': parseInt($(arr[0]).text()),
                        'country': $(arr[1]).attr('alt'),
                        'name': s.trim($(arr[2]).text()),
                        'points': parseInt($(arr[3]).text().replace(',', ''))
                    };
                });
            }
        });
    }
});
