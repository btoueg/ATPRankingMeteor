
Meteor.startup(function () {

    Meteor.publish("atp_men_singles_ranking", function (ranking_date) {
        return MenSingles.find({date:ranking_date});
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
                record.ranking = parseInt(record.ranking);
                record.date = moment(record.date, "DD.MM.YYYY").toDate();
                MenSingles.insert(record);
            })
        });
    }
});
