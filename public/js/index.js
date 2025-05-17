// radhe radhe

let ip;

function inputHandler() {
    document.addEventListener('DOMContentLoaded', function() {
        const inputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
        
        // Remove the onkeyup attribute that was causing issues
        inputs.forEach(input => {
            input.removeAttribute('onkeyup');
        });
        
        // Add proper event listeners
        inputs.forEach((input, index) => {
            // Handle input (typing a character)
            input.addEventListener('input', function(e) {
                // Keep only numbers
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Move to next input if a number was entered
                if (this.value !== '' && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            // Handle all keypresses
            input.addEventListener('keydown', function(e) {
                // Backspace handling
                if (e.key === 'Backspace') {
                    // If current input has a value, just clear it
                    if (this.value !== '') {
                        this.value = '';
                        return;
                    }
                    
                    // If current input is empty, go to previous and clear it
                    if (index > 0) {
                        inputs[index - 1].value = '';
                        inputs[index - 1].focus();
                    }
                }
                
                // Arrow left - move focus left if possible
                else if (e.key === 'ArrowLeft' && index > 0) {
                    inputs[index - 1].focus();
                }
                
                // Arrow right - move focus right if possible
                else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                
                // Delete key - just clear current input
                else if (e.key === 'Delete') {
                    this.value = '';
                }
            });
        });
        
        // Handle paste event on the first input
        inputs[0].addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            
            if (/^\d+/.test(pasteData)) {
                // Extract only digits
                const digits = pasteData.replace(/\D/g, '');
                
                // Fill inputs with pasted digits
                for (let i = 0; i < Math.min(digits.length, inputs.length); i++) {
                    inputs[i].value = digits[i];
                }
                
                // Focus the appropriate input after paste
                if (digits.length >= inputs.length) {
                    inputs[inputs.length - 1].focus();
                } else if (digits.length > 0) {
                    inputs[digits.length].focus();
                }
            }
        });
        
        // Add paste handler to all inputs
        inputs.forEach(input => {
            input.addEventListener('paste', function(e) {
                // Redirect all paste events to the first input
                e.preventDefault();
                inputs[0].focus();
                
                // Create a new paste event for the first input
                const clipboardData = e.clipboardData || window.clipboardData;
                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: clipboardData,
                    bubbles: true
                });
                
                // Dispatch the paste event on the first input
                setTimeout(() => {
                    inputs[0].dispatchEvent(pasteEvent);
                }, 0);
            });
        });
        
        // Add button handler
        
    });
}

inputHandler()

async function getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      
      // set the ip
      ip = data.ip
      
    } catch (error) {
        console.error("Failed to get IP address:", error);
    }
}

getUserIP()

function joinRoom() {

    const inputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
    const socket = io()
        
    document.querySelector('.joinRoomBtn')
    .addEventListener('click', async function() {

        const code = Array.from(inputs).map(input => input.value || '').join('');
        
        // requesting server to join room
        code.length === 6 ? socket.emit("joinRoom" , {roomId: code , IP: ip}) : alert('Please enter all 6 digits');
        
    });

    socket.on("joinRoomAck" , (ack) => {
        if (ack.success) {
            location.href = `/room/${ack.roomId}`
            socket.join(ack.roomId)
        } else {
            alert("server denied!")
        }
        
    })
    
}

joinRoom()