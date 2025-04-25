
    const layer = document.getElementById('layer1');
    const words = [
		  "Build the future with every line of code",
		  "Where design meets data",
		  "Pixels with purpose",
		  "Code is the new craftsmanship",
		  "Smart systems, smarter humans",
		  "Scroll into innovation",
		  "Logic meets imagination",
		  "From prototype to paradigm shift",
		  "Design systems, not just screens",
		  "Information wants to be beautiful",
		  "Interfaces with intent",
		  "Black boxes, clear thinking",
		  "Applied intelligence, designed impact",
		  "Master the tech, shape the world",
		  "Beyond the screen lies transformation"
		];
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const handCursor = document.getElementById('handCursor');
  
    function createSquare() {
      const sizeVW = Math.random() * 5 + 1;
      const size = (sizeVW / 50) * screenW;
      const xOffset = screenW / 2 + (Math.random() * 0.2 - 0.1) * screenW;

      const square = document.createElement('div');
      square.className = 'square';
      square.style.width = size + 'px';
      square.style.height = size + 'px';
      square.style.left = (xOffset - size / 2) + 'px';
      square.style.top = '0px';

      square.addEventListener('mouseenter', () => triggerWord(square));
      square.dataset.hoverable = "true";

      square.addEventListener('animationend', () => {
        square.remove();
        createSquare();
      });

      layer.appendChild(square);
    }
	
function playRaindropSoundFrom90Percent() {
  const audio = new Audio("dripping-water-nature-sounds-8050.mp3");

  // Random startvolume tussen 0.2 en 1.0
  const startVolume = Math.random() * 0.5 + 0.2;
  audio.volume = startVolume;

  // Wacht tot metadata geladen is
  audio.addEventListener("loadedmetadata", () => {
    const duration = audio.duration;
    const fadeStart = duration * 0.98;
    const fadeDuration = duration - fadeStart;

    audio.currentTime = duration * 0.9;
    audio.play();

    // Start fade-out iets voor 98% van de totale duur
    const checkFade = setInterval(() => {
      if (audio.currentTime >= fadeStart) {
        clearInterval(checkFade);

        const fadeSteps = 20;
        let step = 0;
        const fadeInterval = fadeDuration / fadeSteps;

        const fade = setInterval(() => {
          step++;
          audio.volume = startVolume * (1 - step / fadeSteps);
          if (step >= fadeSteps) {
            clearInterval(fade);
            audio.volume = 0;
          }
        }, fadeInterval * 1000); // omrekenen naar milliseconden
      }
    }, 100);
  });
}




	function setRandomFontStyle(word) {
	  // Kies willekeurige font size uit een lijst
	  const sizes = ['0.5vw', '1vw', '1vw', '2.4vw', '20vw', '70vw', '90vw'];
	  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
	  word.style.fontSize = randomSize;

	  // Random spiegeling: normaal of gespiegeld
	  const flip = Math.random() < 0.5 ? -1 : 1;

	  // Random rotatie: -90 of 90 graden
	  const rotation = Math.random() < 0.5 ? -90 : 90;

	  // Combineer beide in transform
	  word.style.transform = `scaleX(${flip}) rotate(${rotation}deg)`;

	  // Random casing: upper of lower
	  const text = word.textContent;
	  word.textContent = Math.random() < 0.5 ? text.toUpperCase() : text.toLowerCase();
	}


	function createWord(square) {
		const word = document.createElement('div');
		word.className = 'word';
		word.innerText = words[Math.floor(Math.random() * words.length)];
		const direction = Math.random() > 0.5 ? '100vw' : '-100vw';
		word.style.setProperty('--dir', direction);

		setRandomFontStyle(word);
		square.appendChild(word);
		
		word.addEventListener('animationend', () => {
			word.remove();
		});

	}
	
	function animateRipple() {

	  const ripples = handCursor.querySelectorAll('.ripple');

	  ripples.forEach(ripple => {
		ripple.style.animation = 'none';
		// force reflow om animatie opnieuw te triggeren
		void ripple.offsetWidth;
		ripple.style.animation = '';
		ripple.classList.add('ripple'); // heractiveer animatieklasse
	  });
	}

	function triggerWord(square) {
	  if (square.dataset.hoverable !== "true") return; // extra bescherming
	  square.dataset.hoverable = "false";

		createWord(square);
		animateRipple();
		playRaindropSoundFrom90Percent(); 
		
	}


    for (let i = 0; i < 30; i++) {
      setTimeout(createSquare, i * 400);
    }
