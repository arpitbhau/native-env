// radhe radhe

const socket = io()

function dropDownListUI() {
    document.addEventListener('DOMContentLoaded', function() {
        // Toggle dropdown for devices
        const dropdownButton = document.getElementById('devicesDropdown');
        const dropdownContent = document.getElementById('devicesList');
        const dropdownArrow = document.getElementById('dropdownArrow');
        
        dropdownButton.addEventListener('click', function() {
            dropdownContent.classList.toggle('hidden');
            dropdownArrow.classList.toggle('rotate-180');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.classList.add('hidden');
                dropdownArrow.classList.remove('rotate-180');
            }
        });
    });
}

dropDownListUI()

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

function setConnectedDevices() {
    let ip;

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
    
    let UI = {
        
        "pc": `<li class="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold">PC</span>
                </div>
                <div>
                    <p class="font-medium">Desktop PC</p>
                    <p class="text-xs text-zinc-400">${ip}</p>
                </div>
            </div>
            <span class="bg-green-500 h-3 w-3 rounded-full"></span>
        </div>
    </li>` ,
        "phone": `<li class="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="bg-purple-500 h-8 w-8 rounded-full flex items-center justify-center">
                            <span class="text-sm font-bold">PH</span>
                        </div>
                        <div>
                            <p class="font-medium">Phone</p>
                            <p class="text-xs text-zinc-400">${ip}</p>
                        </div>
                    </div>
                    <span class="bg-green-500 h-3 w-3 rounded-full"></span>
                </div>
            </li>` ,
        "tablet": `<li class="px-4 py-3 hover:bg-zinc-800 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="bg-orange-500 h-8 w-8 rounded-full flex items-center justify-center">
                                <span class="text-sm font-bold">TB</span>
                            </div>
                            <div>
                                <p class="font-medium">Tablet</p>
                                <p class="text-xs text-zinc-400">${ip}</p>
                            </div>
                        </div>
                        <span class="bg-green-500 h-3 w-3 rounded-full"></span>
                    </div>
                </li>`

    }

    document.querySelector(".devicesList ul").innerHTML = UI.getDeviceType()


}

setConnectedDevices()