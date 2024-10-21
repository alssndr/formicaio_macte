document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chatBox');
    const chatMessage = document.getElementById('chatMessage');
    const cursor = document.getElementById('cursor');
    const typeSound = document.getElementById('typeSound');
    const dingSound = document.getElementById('dingSound');
    const fadeOverlay = document.getElementById('fadeOverlay');
    const background = document.querySelector('.background');
    const imageBox = document.getElementById('imageBox');
    const dialogImage = document.getElementById('dialogImage');
    const userInputBox = document.getElementById('userInputBox');
    const userInputField = document.getElementById('userInputField');
    const sendButton = document.getElementById('sendButton');

    let inputCount = 0;

    const messages = [
        "Bzz... Bzz..",
        "How do you feel about your work?" // New message
    ];

    let currentMessageIndex = 0;
    let isAnimating = false;

    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            chatMessage.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            typeSound.play();
            setTimeout(function () {
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
            const response = await fetch('http://127.0.0.1:5008/ask', {  // Updated to a relative path to work both locally and on Heroku
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
        async function processInput() {
            const userInput = userInputField.value;
            if (userInput) {
                inputCount++;
                chatMessage.innerHTML += `<p>You: ${userInput}</p>`;
                userInputField.value = '';
                const aiResponse = await sendMessageToBackend(userInput);
                chatMessage.innerHTML += `<p>Agent: ${aiResponse}</p>`;
                chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom

                if (inputCount >= 6) {
                    setTimeout(startFinalMessageTransition, 2000);
                }
            }
        }

        userInputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processInput();
            }
        });

        sendButton.addEventListener('click', processInput);
    }

    function startFinalMessageTransition() {
        chatBox.style.transition = 'opacity 2s';
        userInputBox.style.transition = 'opacity 2s';
        chatBox.style.opacity = '0';
        userInputBox.style.opacity = '0';

        setTimeout(() => {
            chatBox.style.display = 'none';
            userInputBox.style.display = 'none';
            showFinalMessage();
        }, 2000);
    }

    function showFinalMessage() {
        const finalMessageBox = document.createElement('div');
        finalMessageBox.id = 'finalMessageBox';
        finalMessageBox.style.position = 'absolute';
        finalMessageBox.style.top = '50%';
        finalMessageBox.style.left = '50%';
        finalMessageBox.style.transform = 'translate(-50%, -50%)';
        finalMessageBox.style.textAlign = 'center';
        finalMessageBox.style.fontSize = '24px';
        finalMessageBox.style.color = 'white';
        finalMessageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        finalMessageBox.style.padding = '20px';
        finalMessageBox.style.borderRadius = '10px';
        finalMessageBox.style.opacity = '0';
        finalMessageBox.style.transition = 'opacity 2s';
        finalMessageBox.innerHTML = "Agent suddenly left. Reflect on how you feel";

        document.body.appendChild(finalMessageBox);

        setTimeout(() => {
            finalMessageBox.style.opacity = '1';
        }, 50);
    }

    function revealBackgroundAndPromptUser() {
        console.log("Revealing background and prompting user");
        fadeOverlay.style.opacity = '0';
        background.style.opacity = '1';
        imageBox.style.display = 'none';
        setTimeout(() => {
            chatMessage.innerHTML = '';
            userInputBox.style.display = 'block';
            userInputField.focus();
            handleUserInput();
        }, 1500);
    }

    function handleInteraction() {
        if (isAnimating || currentMessageIndex >= messages.length) return;
        isAnimating = true;

        fadeTransition(() => {
            typeWriter(messages[currentMessageIndex], 0, function () {
                dingSound.play();
                chatBox.classList.add('shake');
                setTimeout(() => {
                    chatBox.classList.remove('shake');

                    if (currentMessageIndex === 1) {
                        imageBox.style.display = 'block';
                        dialogImage.classList.add('fade-out');
                        setTimeout(() => {
                            dialogImage.src = 'asset/css/png/slide-dialogo0.jpeg';
                            dialogImage.classList.remove('fade-out');
                            dialogImage.classList.add('fade-in');
                        }, 500);
                        setTimeout(() => {
                            dialogImage.classList.remove('fade-in');
                        }, 1000);
                    }
                    if (currentMessageIndex === 3) {
                        dialogImage.classList.add('fade-out');
                        setTimeout(() => {
                            dialogImage.src = 'asset/css/png/slide-dialogo3.jpeg';
                            dialogImage.classList.remove('fade-out');
                            dialogImage.classList.add('fade-in');
                        }, 500);
                        setTimeout(() => {
                            dialogImage.classList.remove('fade-in');
                        }, 1000);
                    }

                    currentMessageIndex++;
                    isAnimating = false;

                    if (currentMessageIndex === messages.length) {
                        console.log("Final message displayed");
                        setTimeout(revealBackgroundAndPromptUser, 2000);
                    }
                }, 500);
            });
        });
    }

    cursor.addEventListener('click', handleInteraction);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !userInputBox.contains(document.activeElement)) {
            handleInteraction();
        }
    });
});

function scrollChatToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}