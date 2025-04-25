(() => {
  const video = document.getElementById("videoBg");
  const handCursorElement = document.getElementById("handCursor");
  const cameraSelect = document.getElementById("cameraSelect");

  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const handDetector = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
  handDetector.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  handDetector.onResults(results => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const middle = hand[9];
      const x = (1 - middle.x) * screenW;
      const y = middle.y * screenH;

      handCursorElement.style.display = "block";
      handCursorElement.style.left = `${x}px`;
      handCursorElement.style.top = `${y}px`;

      const element = document.elementFromPoint(x, y);
      if (element && element.classList.contains("square") && element.dataset.hoverable === "true") {
        if (typeof triggerWord === "function") triggerWord(element);
        element.dataset.hoverable = "false";
      }
    } else {
      handCursorElement.style.display = "none";
    }
  });

  async function getCamerasAndPrompt() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === "videoinput");

    if (videoDevices.length === 0) {
      alert("Geen camera's gevonden.");
      return;
    }

    // dropdown vullen
    cameraSelect.innerHTML = '<option disabled selected>Kies een camera...</option>';
    videoDevices.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label || `Camera ${index + 1}`;
      cameraSelect.appendChild(option);
    });

    cameraSelect.style.display = "block";

    cameraSelect.addEventListener("change", async () => {
      const selectedDeviceId = cameraSelect.value;
      cameraSelect.style.display = "none";

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId }, width: screenW, height: screenH }
      });

      video.srcObject = stream;
      video.play();

      // Begin het handtracken op basis van frames
      requestAnimationFrame(async function detectFrame() {
        await handDetector.send({ image: video });
        requestAnimationFrame(detectFrame);
      });

      if (typeof initSquares === "function") initSquares();
    });
  }

  getCamerasAndPrompt();
  
	let lastMouseMove = Date.now();
	let mouseVisible = true;

	function showMouseTemporarily() {
		if (!mouseVisible) {
		document.body.style.cursor = "default";
		mouseVisible = true;
	}

		lastMouseMove = Date.now();
	}

	function checkMouseInactivity() {
		const now = Date.now();
		if (mouseVisible && now - lastMouseMove > 2000) { // 2 seconden geen beweging
		document.body.style.cursor = "none";
		mouseVisible = false;
		}
		requestAnimationFrame(checkMouseInactivity);
	}

	window.addEventListener("mousemove", showMouseTemporarily);
	requestAnimationFrame(checkMouseInactivity);

})();
