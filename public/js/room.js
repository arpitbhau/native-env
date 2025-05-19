// radhe radhe

const socket = io()
let ip
const roomId = location.href.split("/")[location.href.split("/").length - 1]

async function setTextToDB(text) {
    try {
        const response = await axios.post("/api/setText" , {
            text: text , 
            roomId: roomId , 
            IP: ip
        })

        if (response.data.success) true
        else false

    }catch (error){
        console.log(error);
    }
    
}

function getDeviceType() {
    const ua = navigator.userAgent;
  
    if (/tablet|ipad|playbook|silk|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
  
    if (/Mobile|iPhone|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return "mobile";
    }
  
    return "desktop";
}

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

function deleteRoomSock() {

    socket.emit("deleteRoom" , {roomId: roomId})

    socket.on("ackDeleteRoom" , dets => {
        return dets.success
    })
  
}

// ===========UI FUNCTIONALITY==============
function uiFunctionality() {
    document.addEventListener('DOMContentLoaded', function() {
        // Toggle devices dropdown
        const devicesDropdown = document.getElementById('devicesDropdown');
        const devicesList = document.getElementById('devicesList');
        const dropdownArrow = document.getElementById('dropdownArrow');
        
        devicesDropdown.addEventListener('click', function() {
            devicesList.classList.toggle('hidden');
            dropdownArrow.classList.toggle('rotate-180');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!devicesDropdown.contains(event.target)) {
                devicesList.classList.add('hidden');
                dropdownArrow.classList.remove('rotate-180');
            }
        });
        
        // Message sending functionality
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const messageContainer = document.getElementById('messageContainer');
        
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {

            function setMessageInDiv(message , sockIp) {
        
                if (message) {
                    // Create message element
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message flex gap-3 mb-4';
                    
                    // Get current time
                    const now = new Date();
                    const hours = now.getHours();
                    const minutes = now.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
                    
                    // Set message content
                    messageDiv.innerHTML = `
                        <div class="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                            <span class="text-xs font-bold">PC</span>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-medium">${sockIp}</span>
                                <span class="text-xs text-zinc-500">${timeString}</span>
                            </div>
                            <p class="text-zinc-300">${message}</p>
                        </div>
                    `;
                    
                    // Add message to container and clear input
                    messageContainer.appendChild(messageDiv);
                    messageInput.value = '';
                    
                    // Scroll to bottom of message container
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }
            }

            socket.on("ackText" , async dets => {
                if (!dets.success) return null
                
                setMessageInDiv(dets.text , dets.IP)

                await setTextToDB(dets.text)
            })

            
        }
        
        // File upload functionality
        const fileInput = document.getElementById('fileInput');
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileTypeIcon = document.getElementById('fileTypeIcon');
        const removeFile = document.getElementById('removeFile');
        const shareFileBtn = document.getElementById('shareFileBtn');
        
        let currentFile = null;
        
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                currentFile = this.files[0];
                displayFilePreview(currentFile);
            }
        });
        
        // Drag and drop functionality
        const dropArea = document.querySelector('.border-dashed');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('border-blue-500');
            dropArea.classList.remove('border-zinc-700');
        }
        
        function unhighlight() {
            dropArea.classList.remove('border-blue-500');
            dropArea.classList.add('border-zinc-700');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files && files[0]) {
                currentFile = files[0];
                displayFilePreview(currentFile);
            }
        }
        
        function displayFilePreview(file) {
            // Show file preview
            filePreview.classList.remove('hidden');
            
            // Set file name and size
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            
            // Set appropriate icon based on file type
            updateFileTypeIcon(file.type);
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function updateFileTypeIcon(fileType) {
            // Default icon is document
            let iconColor = 'bg-blue-500';
            let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
            
            // Check file type and set appropriate icon
            if (fileType.startsWith('image/')) {
                iconColor = 'bg-red-500';
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>';
            } else if (fileType === 'application/pdf') {
                iconColor = 'bg-yellow-500';
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>';
            } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
                iconColor = 'bg-green-500';
                iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" /></svg>';
            }
            
            fileTypeIcon.className = `${iconColor} h-8 w-8 rounded-md flex items-center justify-center`;
            fileTypeIcon.innerHTML = iconSvg;
        }
        
        // Remove file
        removeFile.addEventListener('click', function() {
            currentFile = null;
            fileInput.value = null;
            filePreview.classList.add('hidden');
        });
        
        // Share file
        shareFileBtn.addEventListener('click', function() {
            if (currentFile) {
                // Add file to shared files grid (in real app would upload to server)
                addFileToSharedFiles(currentFile);
                
                // Reset file input
                currentFile = null;
                fileInput.value = null;
                filePreview.classList.add('hidden');
                
                // Show success message
                showNotification('File shared successfully!');
            } else {
                showNotification('Please select a file to share', 'error');
            }
        });
        
        function addFileToSharedFiles(file) {
            const filesGrid = document.querySelector('.grid');
            
            // Determine file type icons and labels
            let fileTypeIcon, fileTypeLabel;
            
            if (file.type.startsWith('image/')) {
                fileTypeIcon = `
                    <div class="bg-red-500 h-6 w-6 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                    </div>
                `;
                fileTypeLabel = 'Image File';
            } else if (file.type === 'application/pdf') {
                fileTypeIcon = `
                    <div class="bg-yellow-500 h-6 w-6 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </div>
                `;
                fileTypeLabel = 'PDF Document';
            } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
                fileTypeIcon = `
                    <div class="bg-green-500 h-6 w-6 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                `;
                fileTypeLabel = 'Excel Spreadsheet';
            } else {
                fileTypeIcon = `
                    <div class="bg-blue-500 h-6 w-6 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                        </svg>
                    </div>
                `;
                fileTypeLabel = 'Document';
            }
            
            // Create new file element
            const fileElement = document.createElement('div');
            fileElement.className = 'bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all hover:border-zinc-700 hover:shadow-md hover:shadow-white/5';
            fileElement.innerHTML = `
                <div class="p-4 border-b border-zinc-800">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            ${fileTypeIcon}
                            <span class="font-medium truncate">${file.name}</span>
                        </div>
                        <span class="text-xs text-zinc-500">${formatFileSize(file.size)}</span>
                    </div>
                    <div class="text-xs text-zinc-400 mt-1">${fileTypeLabel}</div>
                </div>
                <div class="px-4 py-3 bg-zinc-800/30 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center">
                            <span class="text-xs font-bold">PC</span>
                        </div>
                        <span class="text-xs">MacBook Pro (You)</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="p-1.5 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            // Add to the beginning of the grid
            filesGrid.insertBefore(fileElement, filesGrid.firstChild);
            
            // Add to message area that file was shared
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message flex gap-3 mb-4';
            
            // Get current time
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
            
            let fileName
            let fileSize
            let sockIp

            socket.on("ackFile" , dets => {
                if (!dets.success) return
                fileName = dets.fileName
                fileSize = dets.fileSize
                sockIp = dets.IP
            })

            messageDiv.innerHTML = `
                <div class="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold">PC</span>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-medium">${sockIp}</span>
                        <span class="text-xs text-zinc-500">${timeString}</span>
                    </div>
                    <p class="text-zinc-300">Shared file: ${fileName || file.name} (${formatFileSize(fileSize || file.size)})</p>
                </div>
            `;
            
            messageContainer.appendChild(messageDiv);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
        
        // Notification system
        function showNotification(message, type = 'success') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg flex items-center gap-2 transition-all transform translate-y-0 opacity-100`;
            
            if (type === 'success') {
                notification.classList.add('bg-green-500', 'text-white');
                notification.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                `;
            } else {
                notification.classList.add('bg-red-500', 'text-white');
                notification.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                `;
            }
            
            notification.innerHTML += message;
            
            // Add to body
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('translate-y-4', 'opacity-0');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        // Delete room confirmation dialog
        const deleteRoomBtn = document.querySelector('.bg-red-600');
        deleteRoomBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this room? All files will be permanently removed.')) {

                if (deleteRoomSock()) {

                    showNotification('Room deleted successfully');
                    // In a real application, this would redirect to another page
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }

            }
        });
    });
}

function textUploadingSock() {

    document.querySelector("#sendMessageBtn")
    .addEventListener("click" , () => {

        let text = document.querySelector("#messageInput").value
        
        //cheking if text is empty 
        if (text.length <= 0) return null

        
        
        // socket work
        socket.emit("textUpload" , {IP: ip , text: text  , roomId: roomId})
        
        // sockets for displaying message is set on lines 68 and 335




    })




}

function setUsersList() {

    socket.emit("getUsers" , {roomId: roomId})

    socket.on("ackGetUsers" , dets => {


        console.log(dets);

        
        dets.users.forEach( user => {
            let div = `<li class="px-4 py-2 hover:bg-zinc-800 flex items-center gap-3">
                            <div class="bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center">
                                <span class="text-xs font-bold">PC</span>
                            </div>
                            <span>${user}</span>
                        </li>`

            // set the elem in parent div
            document.querySelector("#devicesList ul")
            .innerHTML += div

        })

    
    })

}

async function main() {
    uiFunctionality()
    await getUserIP()
    textUploadingSock()
    // setUsersList()

}

main()