let capturedMedia = null;
let cameraStream = null; // Stream object to handle the camera

// Open the camera and display the preview
function openCamera() {
  const cameraContainer = document.getElementById("cameraContainer");
  const cameraPreview = document.getElementById("cameraPreview");

  // Show the camera container
  cameraContainer.style.display = "block";
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      cameraStream = stream;
      cameraPreview.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error accessing camera:", error);
    });
}

// Capture a photo from the camera
function capturePhoto() {
  const video = document.getElementById("cameraPreview");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the captured photo to a data URL
  capturedMedia = {
    type: "image",
    url: canvas.toDataURL("image/png"),
  };

  // Display the captured image in the media preview
  document.getElementById(
    "mediaPreview"
  ).innerHTML = `<img src="${capturedMedia.url}" style="max-width: 200px;">`;

  stopCamera(); // Stop the camera after capturing the photo
}

// Stop the camera preview
function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  document.getElementById("cameraContainer").style.display = "none";
}

// Preview media from file input or the camera capture
function previewMedia() {
  const file = document.getElementById("mediaInput").files[0];
  const preview = document.getElementById("mediaPreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      capturedMedia = {
        type: file.type.includes("image") ? "image" : "video",
        url: e.target.result,
      };

      preview.innerHTML = `<${
        capturedMedia.type === "image" ? "img" : "video"
      } src="${e.target.result}" controls style="max-width: 200px;"></${
        capturedMedia.type === "image" ? "img" : "video"
      }>`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "";
    capturedMedia = null;
  }
}

// Send the message with text and optional media
function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const recipientSelect = document.getElementById("recipientSelect");
  const content = messageInput.value.trim();
  const recipient = role === "admin" ? recipientSelect.value : "admin";

  if (content || capturedMedia) {
    const newMessage = {
      sender: username,
      receiver: recipient === "all" ? "everyone" : recipient,
      content: content,
      media: capturedMedia,
    };

    saveMessageToDB(newMessage);
    messageInput.value = "";
    document.getElementById("mediaPreview").innerHTML = "";
    capturedMedia = null;
  } else {
    alert("Please enter a message or add media.");
  }
}
