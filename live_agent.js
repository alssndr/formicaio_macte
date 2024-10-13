document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const chatMessage = document.getElementById('chatMessage');
    const cursor = document.getElementById('cursor');
    const typeSound = document.getElementById('typeSound');
    const dingSound = document.getElementById('dingSound');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const startChatBox = document.getElementById('startChatBox');
    const fadeOverlay = document.getElementById('fadeOverlay');
    const background = document.querySelector('.background');
    
    // Adding a new input field for typing in the white box
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'userInputField';
    inputField.style.width = '100%';
    inputField.style.height = '50px';
    inputField.style.fontSize = '16px';
    inputField.style.padding = '10px';
    inputField.style.borderRadius = '10px';
    inputField.style.border = '1px solid #ccc';
    inputField.placeholder = 'Type here to start the chat...';
    startChatBox.appendChild(inputField);

    const messages = [
        "Bzz... Bzz..",
        "\"I’m the Agent, the one they sent from the Formicaio.\"",
    ];

    let currentMessageIndex = 0;
    let isAnimating = false;

    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            chatMessage.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            typeSound.play();
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback);
            }, 50);
        } else if (typeof fnCallback === 'function') {
            setTimeout(fnCallback, 500);
        }
    }

    function fadeTransition(callback) {
        chatMessage.style.transition = 'opacity 0.5s';
        chatMessage.style.opacity = '0';
        setTimeout(() => {
            chatMessage.innerHTML = '';
            chatMessage.style.opacity = '1';
            if (callback) callback();
        }, 500);
    }

    async function sendMessageToBackend(message) {
        try {
            const response = await fetch('https://formicaio-741a0190069d.herokuapp.com/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error communicating with backend:', error);
            return "Sorry, I couldn't process that.";
        }
    }

    function handleUserInput() {
        const userInput = inputField.value; // Collect user input from the white box
        if (userInput) {
            typeWriter(`You: ${userInput}`, 0, async function() {
                dingSound.play();
                chatBox.classList.add('shake');
                setTimeout(async () => {
                    chatBox.classList.remove('shake');
                    const aiResponse = await sendMessageToBackend(userInput); // Send to backend
                    typeWriter(`AI: ${aiResponse}`, 0, function() {
                        dingSound.play();
                    });
                }, 500);
            });
            inputField.value = ''; // Clear the input field after sending the message
        }
    }

    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleUserInput(); // Trigger input handling when 'Enter' is pressed
        }
    });

    cursor.addEventListener('click', function() {
        if (isAnimating || currentMessageIndex >= messages.length) return;
        isAnimating = true;

        fadeTransition(() => {
            typeWriter(messages[currentMessageIndex], 0, function() {
                dingSound.play();
                chatBox.classList.add('shake');
                setTimeout(() => {
                    chatBox.classList.remove('shake');
                    currentMessageIndex++;
                    isAnimating = false;

                    if (currentMessageIndex === messages.length) {
                        setTimeout(() => {
                            fadeTransition(() => {
                                welcomeMessage.style.transition = 'opacity 1s';
                                welcomeMessage.style.opacity = '0';
                                fadeOverlay.style.transition = 'opacity 1s';
                                fadeOverlay.style.opacity = '0';
                                background.style.transition = 'opacity 1s';
                                background.style.opacity = '1';
                                setTimeout(() => {
                                    welcomeMessage.style.display = 'none';
                                    startChatBox.style.display = 'block';
                                    startChatBox.style.opacity = '0';
                                    setTimeout(() => {
                                        startChatBox.style.transition = 'opacity 0.5s';
                                        startChatBox.style.opacity = '1';
                                        setTimeout(() => {
                                            typeWriter("Now it's time for you to talk.", 0, function() {
                                                dingSound.play();
                                                chatBox.classList.add('shake');
                                                setTimeout(() => {
                                                    chatBox.classList.remove('shake');
                                                }, 500);
                                            });
                                        }, 1000);
                                    }, 50);
                                }, 1000);
                            });
                        }, 1500);
                    }
                }, 500);
            });
        });
    });
});