document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    const startButton = document.querySelector('.start-btn');
    const tutorialButton = document.querySelector('.tutorial-btn');
    const soundButton = document.querySelector('.sound-btn');
    const volumeSlider = document.getElementById('volumeSlider');
    const chatBox = document.getElementById('chatBox');
    const chatBoxInner = chatBox.querySelector('.chat-box-inner');
    const cursor = document.getElementById('cursor');
    const fadeOverlay = document.getElementById('fadeOverlay');
    const background = document.querySelector('.background');
    const imageBox = document.getElementById('imageBox');
    const dialogImage = document.getElementById('dialogImage');
    const userInputBox = document.getElementById('userInputBox');
    const userInputField = document.getElementById('userInputField');
    const sendButton = document.getElementById('sendButton');
    const landingPage = document.getElementById('landingPage');
    const chatbotSection = document.getElementById('chatbotSection');
    const footer = document.querySelector('.footer_text');

    // Audio setup with better initialization
    const menuAudio = new Audio('asset/css/kinked_menu_fancy.mp3');
    const gameAudio = new Audio('asset/css/kinked_game (FANCY).mp3');
    let currentAudio = menuAudio;
    let isPlaying = false;

    // Initial audio setup
    menuAudio.loop = true;
    gameAudio.loop = true;
    
    // Set initial volume
    if (volumeSlider) {
        const initialVolume = 0.5;
        volumeSlider.value = initialVolume;
        menuAudio.volume = initialVolume;
        gameAudio.volume = initialVolume;
    }

    // Initialize state
    let inputCount = 0;
    let currentMessageIndex = 0;
    let isAnimating = false;
    let canClick = true;
    let lastClickTime = 0;
    const clickDelay = 1000;

    const messages = [
        "Bzz... Bzz..",
        "Bzz... Bzz..",
        "Now it's time for you to talk.",
        "How do you feel about your work?"
    ];

    // Improved audio control functions
    function toggleAudio() {
        if (!currentAudio) return;

        if (isPlaying) {
            currentAudio.pause();
            soundButton.classList.remove('playing');
            soundButton.textContent = 'Sound Off';
        } else {
            currentAudio.play().catch(e => console.error('Playback failed:', e));
            soundButton.classList.add('playing');
            soundButton.textContent = 'Sound On';
        }
        isPlaying = !isPlaying;
    }

    function switchAudio(newAudio) {
        if (!newAudio || newAudio === currentAudio) return;

        const wasPlaying = isPlaying;
        const currentVolume = currentAudio.volume;
        
        // Fade out current audio
        const fadeOut = setInterval(() => {
            if (currentAudio.volume > 0.1) {
                currentAudio.volume -= 0.1;
            } else {
                clearInterval(fadeOut);
                currentAudio.pause();
                currentAudio.volume = currentVolume; // Reset volume for next time
                
                // Switch to new audio
                currentAudio = newAudio;
                currentAudio.volume = 0;
                
                if (wasPlaying) {
                    currentAudio.play().catch(e => console.error('Audio switch failed:', e));
                    
                    // Fade in new audio
                    const fadeIn = setInterval(() => {
                        if (currentAudio.volume < currentVolume - 0.1) {
                            currentAudio.volume += 0.1;
                        } else {
                            currentAudio.volume = currentVolume;
                            clearInterval(fadeIn);
                        }
                    }, 50);
                }
            }
        }, 50);
    }

    // Typewriter animation function
    function typeWriter(text, element, i, fnCallback) {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
            setTimeout(function () {
                typeWriter(text, element, i + 1, fnCallback);
            }, 50);
        } else if (typeof fnCallback === 'function') {
            element.innerHTML = text;
            setTimeout(fnCallback, 500);
        }
    }

    function fadeTransition(callback) {
        if (!chatBoxInner) return;
        
        chatBoxInner.style.transition = 'opacity 0.5s';
        chatBoxInner.style.opacity = '0';
        
        setTimeout(() => {
            chatBoxInner.innerHTML = '';
            chatBoxInner.style.opacity = '1';
            if (callback) callback();
        }, 500);
    }

    async function sendMessageToBackend(message) {
        try {
            const response = await fetch('http://localhost:5025/ask', {
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
        if (!userInputField || !chatBoxInner) return;

        async function processInput() {
            const userInput = userInputField.value.trim();
            if (userInput) {
                inputCount++;
                const userMessage = document.createElement('p');
                chatBoxInner.appendChild(userMessage);
                typeWriter(`You: ${userInput}`, userMessage, 0, async () => {
                    userInputField.value = '';
                    const aiResponse = await sendMessageToBackend(userInput);
                    const aiMessage = document.createElement('p');
                    chatBoxInner.appendChild(aiMessage);
                    typeWriter(`Agent: ${aiResponse}`, aiMessage, 0, () => {
                        scrollChatToBottom();
                        if (inputCount >= 6) {
                            setTimeout(startFinalMessageTransition, 2000);
                        }
                    });
                });
            }
        }

        userInputField.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                processInput();
            }
        });

        sendButton.addEventListener('click', processInput);
    }

    function handleInteraction(event) {
        if (isAnimating || currentMessageIndex >= messages.length) return;
        if (event.target.closest('#userInputBox')) return;
        
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < clickDelay) {
            return;
        }
        lastClickTime = currentTime;
        
        isAnimating = true;
        canClick = false;
        
        fadeTransition(() => {
            const messageElement = document.createElement('div');
            chatBoxInner.appendChild(messageElement);
            typeWriter(messages[currentMessageIndex], messageElement, 0, function () {
                if (chatBox) chatBox.classList.add('shake');
                
                setTimeout(() => {
                    if (chatBox) chatBox.classList.remove('shake');

                    if (currentMessageIndex === 1 || currentMessageIndex === 3) {
                        if (imageBox && dialogImage) {
                            imageBox.style.display = 'block';
                            dialogImage.classList.add('fade-out');
                            
                            setTimeout(() => {
                                dialogImage.src = `asset/css/png/slide-dialogo${currentMessageIndex === 1 ? '0' : '3'}.jpeg`;
                                dialogImage.classList.remove('fade-out');
                                dialogImage.classList.add('fade-in');
                                
                                setTimeout(() => {
                                    dialogImage.classList.remove('fade-in');
                                }, 500);
                            }, 500);
                        }
                    }

                    currentMessageIndex++;
                    isAnimating = false;
                    canClick = true;

                    if (currentMessageIndex === messages.length) {
                        setTimeout(revealBackgroundAndPromptUser, 2000);
                    }
                }, 500);
            });
        });
    }

    function revealBackgroundAndPromptUser() {
        if (fadeOverlay) fadeOverlay.style.opacity = '0';
        if (background) background.style.opacity = '1';
        if (imageBox) imageBox.style.display = 'none';
        
        if (chatBox) {
            chatBox.style.transition = 'width 0.5s ease-in-out, opacity 1s ease-in-out';
            chatBox.style.width = '100%';
        }
        
        setTimeout(() => {
            if (chatBoxInner) chatBoxInner.innerHTML = '';
            if (userInputBox) {
                userInputBox.style.display = 'block';
                if (userInputField) userInputField.focus();
            }
            handleUserInput();
        }, 1500);
    }

    function startFinalMessageTransition() {
        if (!chatBox || !userInputBox) return;
    
        if (chatBox) {
            chatBox.style.transition = 'width 0.5s ease-in-out, opacity 2s';
            chatBox.style.width = '110%';
        }
    
        chatBox.style.opacity = '0';
        userInputBox.style.transition = 'opacity 2s';
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
        Object.assign(finalMessageBox.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '24px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            opacity: '0',
            transition: 'opacity 2s'
        });
        
        finalMessageBox.innerHTML = "Agent suddenly left. Reflect on how you feel";
        document.body.appendChild(finalMessageBox);

        requestAnimationFrame(() => {
            finalMessageBox.style.opacity = '1';
        });
    }

    function scrollChatToBottom() {
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    function handleStartClick() {
        landingPage.style.display = 'none';
        if (footer) {
            footer.style.display = 'none';
        }
        chatbotSection.style.display = 'block';

        // Explicitly switch from menu to game audio
        switchAudio(gameAudio);
        
        if (fadeOverlay) {
            fadeOverlay.style.background = 'none';
            fadeOverlay.style.backgroundColor = 'transparent';
        }

        if (currentMessageIndex === 0) {
            handleInteraction({ target: document.body });
        }
    }

    // Event Listeners
    if (soundButton) {
        soundButton.addEventListener('click', toggleAudio);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            currentAudio.volume = volume; // Only adjust current audio volume
        });
    }

    if (startButton) {
        startButton.addEventListener('click', handleStartClick);
    }

    if (tutorialButton) {
        tutorialButton.addEventListener('click', function() {
            // Add tutorial functionality if needed
        });
    }

    document.addEventListener('click', function(event) {
        if (canClick) handleInteraction(event);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.target.closest('#userInputBox') && canClick) {
            handleInteraction(event);
        }
    });
});