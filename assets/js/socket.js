
var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#informative-content").html("");
}

function connect() {
    var socket = new SockJS('http://localhost:8080/informative-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/informative/new', function (newInformative) {
            showInformative(JSON.parse(newInformative.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendInformative() {
	var html = $('#summernote').summernote('code');
	console.log(html);
    stompClient.send("/informative", {}, JSON.stringify({'content': html}));
}

function showInformative(body) {
    $("#informative-content").append("<tr><td>" + body + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#connect1" ).ready(function() { connect(); });

    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#sendInformative" ).click(function() { sendInformative(); });
});

