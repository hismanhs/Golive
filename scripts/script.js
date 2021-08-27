// Handle errors.
let handleError = function(err){
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};
const USER_ID = Math.floor(Math.random() * 1000000001);


let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
});

client.init("783432fc9ff04b08ad36998136e48c56", function() {
    console.log("client initialized");
}, function(err) {
    console.log("client init failed ", err);
});

client.join(
    "006783432fc9ff04b08ad36998136e48c56IAAr1m9YCkbYIhvrTE0pooRkCNU+0+VXcPREZ3PdqmVoXxB4Li4AAAAAEADn8NlKo58qYQEAAQCinyph",
    "hisman",
    USER_ID,
    function(uid) {
         console.log("Publish UID",uid);

        let localStream = AgoraRTC.createStream({
            audio: true,
            video: true,
        });
        // Initialize the local stream
        localStream.init(()=>{
            // Play the local stream
            localStream.play("me");
         console.log("Publish local stream successfully");

            // Publish the local stream
            client.publish(localStream, handleError);
        }, handleError);
    //   console.log("User " + uid + " join channel successfully");
    //   client.publish(me.localStream, function(err) {
    //     console.log("Publish local stream error: " + err);
    //   });

    //   client.on("stream-published", function(evt) {
    //     console.log("Publish local stream successfully");
    //   });
    },
    function(err) {
      console.log("Join channel failed", err);
    }
  );
  // Subscribe to the remote stream when it is published
client.on("stream-added", function(evt){
    client.subscribe(evt.stream, handleError);
});
// Play the remote stream when it is subsribed
client.on("stream-subscribed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
});
// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});