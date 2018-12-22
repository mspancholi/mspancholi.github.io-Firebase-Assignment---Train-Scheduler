
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAo7GPN6P6-BF5UySwp8w9uPlRTvcMzqwo",
    authDomain: "train-schedular-mp.firebaseapp.com",
    databaseURL: "https://train-schedular-mp.firebaseio.com",
    projectId: "train-schedular-mp",
    storageBucket: "train-schedular-mp.appspot.com",
    messagingSenderId: "493313594229"
};
firebase.initializeApp(config);


var database = firebase.database();

//  Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabing user input and triming
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainStart = moment($("#start-input").val().trim(), "HH:mm A").format("X");
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainStart: firstTrainStart,
        frequency: frequency
    };

    // Uploads trains data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainStart);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

//  This (below) creates Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Stores (below) everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainStart = childSnapshot.val().firstTrainStart;
    var frequency = childSnapshot.val().frequency;

    // Train Info log
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainStart);
    console.log(frequency);
   
    // using moment to get the first train time
    
    var newfirstTrainStart = moment(firstTrainStart, "HH:mm").subtract(1, "years");
    console.log(newfirstTrainStart);

    var difference = moment().diff(moment(newfirstTrainStart), "minutes");
    console.log("DIFFERENCE IN TIME: " + difference);

    var remainder = difference % frequency;
    console.log(remainder);

    var minAway = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    var nextTrainTime = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("hh:mm A"));


    // Below creates the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(moment(nextTrainTime).format("hh:mm A")),
        $("<td>").text(minAway),

    );

    // Below appends the new row to the table
    $("#train-table > tbody").append(newRow);
});

