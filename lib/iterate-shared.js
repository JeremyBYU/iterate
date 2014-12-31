MyFuncs = new Mongo.Collection("myFuncs");
scope = {};
if (Meteor.isClient) {

    Template.body.helpers({
        myFuncs: function() {
            return MyFuncs.find({});
        }
    });
    // counter starts at 0
    Session.setDefault("counter", 0);
    Template.hello.helpers({
        counter: function() {
            return Session.get("counter");
        }
    });

    Template.hello.events({
        'click button': function() {
            // increment the counter when button is clicked
            Session.set("counter", Session.get("counter") + 1);
        }
    });
    Template.newtonForm.events({
        "submit .form-horizontal": function(event) {
            // This function is called when the new task form is submitted
            getNewtonParams();
            constructNewtonChart();
            // Prevent default form submit
            return false;
        }
    });
    Template.chartControl.events({
        'click button[id="newtonPrev"]': function() {
            //start the time interval

        },
        'click button[id="newtonPlay"]': function() {
            //start the time interval

        },
        'click button[id="newtonPause"]': function() {
            //start the time interval

        },       
        'click button[id="newtonNext"]': function() {
            newtonAnimate(newtonChart);

        }
    });


}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
