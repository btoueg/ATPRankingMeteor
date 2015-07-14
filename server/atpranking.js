
Meteor.startup(function () {

    Meteor.publish("atp_men_singles_ranking", function (period) {
        return MenSingles.find({date:period});
    });

    if (MenSingles.find().count() === 0) {
        Assets.getText('atp_men_singles_ranking.csv', function(error, result) {
            var csvParseSync = Meteor.wrapAsync(CSVParse);
            var output;
            try {
                output = csvParseSync(result, { columns: true });
            } catch (error) {
                throw new Meteor.Error('csv-parse-fail', error.message);
            }

            output.forEach(function(record) {
                if (s(record.date).endsWith('08.2014')) {
                    MenSingles.insert(record);
                }
            })
        });
    }
});
