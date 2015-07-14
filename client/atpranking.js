
Template.body.helpers({
    options: [
        {value: '04.08.2014', label: '04/08/2014'},
        {value: '25.08.2014', label: '25/08/2014'}
    ]
});

Template.body.events({
    'change select': function(evt) {
        Session.set('period', evt.target.value)
    }
});

Meteor.startup(function () {

    Meteor.subscribe("atp_men_singles_ranking");

    Deps.autorun(function(){
        Meteor.subscribe("atp_men_singles_ranking", Session.get('period'));
    })
});