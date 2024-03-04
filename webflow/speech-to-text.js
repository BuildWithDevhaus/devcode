const speechToText = () => {
  let currentRecognition = null;

  document.querySelectorAll('[speech-button]').forEach((button, index) => {
    let recognizing = false;
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    const buttonSVG = button.querySelector('svg');
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    button.addEventListener('click', () => {
      if (currentRecognition && currentRecognition !== recognition) {
        currentRecognition.stop();
      }
      if (recognizing) {
        recognition.stop();
        return;
      }
      recognition.start();
    });

    recognition.onstart = function() {
      recognizing = true;
      buttonSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM5 5.75C5 5.33579 5.33579 5 5.75 5H10.25C10.6642 5 11 5.33579 11 5.75V10.25C11 10.6642 10.6642 11 10.25 11H5.75C5.33579 11 5 10.6642 5 10.25V5.75Z" fill="currentColor"/>
  </svg>`;
      currentRecognition = recognition;
    };

    recognition.onresult = function(event) {
      let input = document.querySelectorAll('[speech-input]')[index];
      input.value = event.results[0][0].transcript;
      input.dispatchEvent(new Event('input'));
    };

    recognition.onend = function() {
      recognizing = false;
      buttonSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
    <path d="M7 4C7 2.34315 8.34315 1 10 1C11.6569 1 13 2.34315 13 4V10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10V4Z" fill="currentColor"/>
    <path d="M5.5 9.64282C5.5 9.22861 5.16421 8.89282 4.75 8.89282C4.33579 8.89282 4 9.22861 4 9.64282V9.99997C4 13.0597 6.29027 15.5845 9.25 15.9535V17.5H7.75C7.33579 17.5 7 17.8358 7 18.25C7 18.6642 7.33579 19 7.75 19H12.25C12.6642 19 13 18.6642 13 18.25C13 17.8358 12.6642 17.5 12.25 17.5H10.75V15.9535C13.7097 15.5845 16 13.0597 16 9.99997V9.64282C16 9.22861 15.6642 8.89282 15.25 8.89282C14.8358 8.89282 14.5 9.22861 14.5 9.64282V9.99997C14.5 12.4852 12.4853 14.5 10 14.5C7.51472 14.5 5.5 12.4852 5.5 9.99997V9.64282Z" fill="white"/>
  </svg>`;
      if (currentRecognition === recognition) {
        currentRecognition = null;
      }
    };
  });
}

speechToText();