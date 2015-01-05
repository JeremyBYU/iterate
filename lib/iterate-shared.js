newtonInterval = "free";
scope = {};
if (Meteor.isClient) {


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
            if (Session.get('newtonIsCreated') == true)
                newtonReverseAnimate(newtonChart);

        },
        'click button[id="newtonPlay"]': function() {
            //start the time interval
            //alert('called Play');
            if (Session.get('newtonIsCreated') == true) {
                if(newtonInterval == "free") {
                    newtonInterval = setInterval(function () {
                        var continueAnimation = newtonAnimate(newtonChart);
                        if (continueAnimation == false) {
                            //alert('stop animation!!');
                            clearInterval(newtonInterval);
                        }
                    }, global_config.animationTime);
                }
            } else {
                alert('newton not created');
                //alert of some sort here...maybe...
            }

        },
        'click button[id="newtonPause"]': function() {
            if (newtonInterval) {
                clearInterval(newtonInterval);
                newtonInterval = "free";
            }

        },
        'click button[id="newtonNext"]': function() {
            if (Session.get('newtonIsCreated') == true)
                newtonAnimate(newtonChart);

        }
    });


}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
