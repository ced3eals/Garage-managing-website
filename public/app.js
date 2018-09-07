$(function() {

  var tableCounter = 0;
  var ref          = new Firebase('https://dream-car-garage.firebaseio.com/');
  var garagesRef   = ref.child('garage');
  var counter      = 1;

  function Car(, year, make, model, cost, reparation) {
    this.year  = year;
    this.make  = make;
    this.model = model;
    this.cost  = cost;
    this.reparation = reparation;
  }

  function Garage(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName  = lastName;
    this.email     = email;
    this.password  = password;
    this.cars      = [];
  }

  Garage.prototype.addCars = function(, year, make, model, cost, reparation){
    this.cars.push(new Car(, year, make, model, cost, reparation));
  };

  //clears the most recently populated row on the create page.
  var removeRow = function () {
    if (counter > 1) {
    $('.warning').remove();
    counter --;
    var totalCost = parseInt($('#total-cost').text());
    var cost      = parseInt($('#cost' + counter).text());
    $('#total-cost').text(totalCost - cost);
    $('#year' + counter).text('');
    $('#make' + counter).text('');
    $('#model' + counter).text('');
    $('#cost' + counter).text(0);
    $('#reparation' + counter).text('');
    
  }
  };

  var clearGarages = function() {
    $('.car-list table').remove();
  };

  //displays a garage table on the view page
  var displayGarage = function(garageList) {
      for (var key in garageList) {
      var tableId = 'table' + tableCounter;
      $('.car-list').append($('<table>')
                      .attr('class', 'vehicle-list twelve columns')
                      .attr('id', tableId));
      $('#' + tableId).append($('<tr>').attr('class', 'user-info')
                      .append($('<th>').text(garageList[key].firstName))
                      .append($('<th>').text(garageList[key].lastName))
                      .append($('<th>').text(garageList[key].email)));
      $('#' + tableId).find('tbody').append($('<tr>')
                                   .append($('<th>').text('Year'))
                                   .append($('<th>').text('Make'))
                                   .append($('<th>').text('Model'))
                                   .append($('<th>').text('Cost'))
                                   );
      for (var j = 0; j < garageList[key].cars.length; j++) {
        $('#' + tableId).find('tbody').append($('<tr>')
                                      .append($('<td>').text(garageList[key].cars[j].year))
                                      .append($('<td>').text(garageList[key].cars[j].make))
                                      .append($('<td>').text(garageList[key].cars[j].model))
                                      .append($('<td>').text(garageList[key].cars[j].cost))
                                      .append($('<td>').text(garageList[key].cars[j].reparation))
                                      );
      }
      tableCounter ++;
    }
  };

  //event listener for add a car button, if total is going to be over 1m refuses entry.
  $('#add').on('click', function() {
    var year  = $('#year').val();
    var check = parseInt(year);
    $('.warning').remove();
      if (1970 < check && check < 2200) {
        var total = 0;
        var cost1 = parseInt($('#cost1').text(), 10);
        var cost2 = parseInt($('#cost2').text(), 10);
        var cost3 = parseInt($('#cost3').text(), 10);
        var cost4 = parseInt($('#cost4').text(), 10);
        var cost5 = parseInt($('#cost5').text(), 10);
        var costInput = parseInt($('#cost').val(), 10);
        total = cost1 + cost2 + cost3 + cost4 + cost5 + costInput;
        if(costInput <= 0) {
          $('#remove').after($('<p>')
                   .attr({ 'id': 'costWarning', 'class': 'warning' })
                   .text('Car reparation cost must be greater than zero'));
        } else if (total <= 500000) {
          var make  = $('#make').val();
          var model = $('#model').val();
          var cost  = $('#cost').val();
          var reparation = $('#reparation').val();
          $('#year' + counter).text(year);
          $('#make' + counter).text(make);
          $('#model' + counter).text(model);
          $('#cost' + counter).text(cost);
           $('#reparation' + counter).text(reparation);
          $('#total-cost').text(total);
          counter ++;
          $(':input','.new-car').val('');
        } else {
          $('#total-cost').text(total - costInput);
          $('#remove').after($('<p>')
                   .attr({ 'id': 'add-warning', 'class': 'warning' })
                   .text('Total Must Be Less Than 500 000 €'));
        }
      } else {
        $('#remove').after($('<p>')
                 .attr({ 'id': 'year-warning', 'class': 'warning' })
                 .text('Year must be 4 digits between 1970 to 2200'));
    }
  });

  //event listener for remove last car button
  $('#remove').on('click', function() {
    removeRow();
  });

  // event listener for the create garage button, clears table and stores garage in firebase
  $('#user-button').on('click', function() {
    $('.warning').remove();
    if ($('#color1').text() !== '') {
      if ($('#user-pw').val() !== '') {
        var firstName = $.trim($('#first-name').val());
        var lastName  = $.trim($('#last-name').val());
        var email     = $.trim($('#email').val());
        var password  = $.trim($('#user-pw').val());
        var newGarage = new Garage(firstName, lastName, email, password);
        for (var i = 1; i <= 5; i++) {
          if ($('#color' + i).text() !== '') {
          newGarage.addCars($('#color' + i).text(), $('#year' + i).text(), $('#make' + i).text(), $('#model' + i).text(), $('#cost' + i).text());
          }
        }
        garagesRef.child(newGarage.firstName + newGarage.lastName).set(newGarage);
        $('#retrieve-button').after($('<p>')
                     .attr({ 'id': 'create-success', 'class': 'success two columns' })
                     .text('Garage successfully created.')
                     .html('<a href="view.html"> Click here to view garages! </a>'));
        for (var j = 0; j < 5; j++) {
          removeRow();
        }
        $('#total-cost').text(0);
        $(':input','.garage-owner-info').val('');
      } else {
        $('#retrieve-button').after($('<p>')
                   .attr({ 'id': 'create-warning', 'class': 'warning two columns' })
                   .text('Please enter a password.'));
      }
    } else {
      $('#retrieve-button').after($('<p>')
                   .attr({ 'id': 'create-warning', 'class': 'warning two columns' })
                   .text('Please enter at least one car'));
    }
  });

  //Click event to retrieve all ready saved garages for editing.
  $('#retrieve-button').on('click', function() {
    var firstName = $.trim($('#first-name').val());
    var lastName  = $.trim($('#last-name').val());
    var password  = $.trim($('#user-pw').val());
    $('.warning').remove();
    $('.success').remove();
    var removeCount = counter;
    for (var j = 0; j < removeCount; j++) {
      removeRow();
    }
    $('#total-cost').text(0);
    garagesRef.on('value', function(snapshot){
      var gar = snapshot.val();
      var totaledCost = 0;
      var fn = firstName+lastName;
      if (gar.hasOwnProperty(fn)) {
        if (gar[fn].password === password) {
          var carsPulled = gar[fn].cars;
          for (var i = 0; i < carsPulled.length; i++) {
            for (var prop in carsPulled[i]) {
              var value = carsPulled[i][prop];
              $('#' + prop + (i+1)).text(value);
              if (prop === 'cost') {
                totaledCost += parseInt(value);
                counter ++;
              }
            }
          }
        } else {
          $('#retrieve-button').after($('<p>')
                   .attr({ 'id': 'create-warning', 'class': 'warning two columns' })
                   .text('Password is incorrect'));
        }
      }
      $('#total-cost').text(totaledCost);
    });
  });

  //everytime a new garage is added to firebase this runs creating a displayed garage on the view page
  ref.on('child_added', function(snapshot) {
    displayGarage(snapshot.val());
  });

  //Sorts the tables on view page by users First name
  $('#sort-first').on('click', function() {
    var garageList = {};
    clearGarages();
    garagesRef.orderByChild('firstName').on('child_added', function(snapshot){
      var garage = snapshot.val();
      garageList[garage.firstName + garage.lastName] = garage;
    });
    displayGarage(garageList);
  });

  //Sorts the tables on view page by users Last name
  $('#sort-last').on('click', function() {
    var garageList = {};
    clearGarages();
    garagesRef.orderByChild('lastName').on('child_added', function(snapshot){
      var garage = snapshot.val();
      garageList[garage.firstName + garage.lastName] = garage;
    });
    displayGarage(garageList);
  });

  //Sorts the tables on view page by users email address
  $('#sort-email').on('click', function() {
    var garageList = {};
    clearGarages();
    garagesRef.orderByChild('email').on('child_added', function(snapshot){
      var garage = snapshot.val();
      garageList[garage.firstName + garage.lastName] = garage;
    });
    displayGarage(garageList);
  });

  //Event Listener for scrolling door
  $('#picture-container').click(function() {
    if ($('#picture-container img').css('top') === '0px') {
      $('#picture-container img').animate({ top: '-1500px'}, 250);
    } else {
      $('#picture-container img').animate({ top: '0px'}, 250);
    }
  });

});


