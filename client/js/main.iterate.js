
if (Meteor.isClient) {

  $(document).ready(function() {
      init();
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
