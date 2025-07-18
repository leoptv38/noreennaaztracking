// Function to display error messages
const showError = (field, errorText) => {
    if (!field) {
        console.error("Error field is null:", errorText);
        return;
    }
    
    field.classList.add("error");
    const errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.innerText = errorText;
    
    const parent = field.closest(".form-group");
    if (parent) {
        parent.appendChild(errorElement);
    } else {
        console.error("Parent container not found for field:", field);
        document.body.prepend(errorElement);
    }
};

// Function to display success messages
const showSuccess = (field, successText) => {
    if (!field) {
        console.log("Success:", successText);
        return;
    }
    
    field.classList.add("success");
    const successElement = document.createElement("small");
    successElement.classList.add("success-text");
    successElement.innerText = successText;
    
    const parent = field.closest(".form-group");
    if (parent) {
        parent.appendChild(successElement);
    } else {
        document.body.prepend(successElement);
    }
};

// Function to clear messages
const clearMessages = () => {
    document.querySelectorAll(".error-text, .success-text").forEach(element => {
        element.remove();
    });
    document.querySelectorAll(".form-group .error, .form-group .success").forEach(field => {
        field.classList.remove("error", "success");
    });
};

// Function to save IP to server
async function saveIP(ip) {
    try {
        const formData = new FormData();
        formData.append('ip', ip);
        
        console.log("Saving IP:", ip);
        const response = await fetch('get_ip.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.text();
        console.log("Save result:", result);
        return result.includes("success");
    } catch (error) {
        console.error("Error saving IP:", error);
        return false;
    }
}

// Function to get IP information
async function getIPInfo(ip) {
    try {
        // Use ipinfo.io with your token
        const response = await fetch(`https://ipinfo.io/${ip}/json?token=649892daca220d`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            success: true,
            data: {
                ip: data.ip || 'N/A',
                country: data.country || 'N/A',
                region: data.region || 'N/A',
                city: data.city || 'N/A',
                isp: data.org || 'N/A',
                org: data.org || 'N/A',
                location: data.loc || 'N/A'
            }
        };
    } catch (error) {
        console.error('Error fetching IP info:', error);
        return {
            success: false,
            message: error.message || 'Failed to get IP information'
        };
    }
}

// Function to display IP info
function displayIPInfo(data) {
    const displayIfExists = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    
    displayIfExists("ipAddress", data.ip);
    displayIfExists("country", data.country);
    displayIfExists("region", data.region);
    displayIfExists("city", data.city);
    displayIfExists("isp", data.isp);
    displayIfExists("org", data.org);
    
    // Show the info container if it exists
    const infoContainer = document.getElementById("ipInfo");
    if (infoContainer) infoContainer.style.display = "block";
}

// Function to get user's current IP
async function getCurrentIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipInput = document.getElementById("ip");
        if (ipInput) ipInput.value = data.ip;
        return data.ip;
    } catch (error) {
        console.error('Error fetching current IP:', error);
        showError(document.getElementById("ip"), 'Failed to get your IP address');
        return null;
    }
}

// Function to handle form submission
const handleFormData = async (e) => {
    e.preventDefault();
    clearMessages();

    // Retrieving input elements
    const ipInput = document.getElementById("ip");
    const ip = ipInput ? ipInput.value.trim() : '';

    // Regular expression pattern for IP address validation
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

    // Performing validation checks
    if (!ip) {
        if (ipInput) showError(ipInput, "Please enter an IP address");
        return;
    }
    
    if (!ipv4Pattern.test(ip) && !ipv6Pattern.test(ip)) {
        if (ipInput) showError(ipInput, "Please enter a valid IP address (IPv4 or IPv6)");
        return;
    }

    try {
        // Get IP information first
        const ipInfo = await getIPInfo(ip);
        
        if (!ipInfo.success) {
            if (ipInput) showError(ipInput, ipInfo.message);
            return;
        }
        
        // Display IP information
        displayIPInfo(ipInfo.data);
        
        // Save IP to server
        const saveResult = await saveIP(ip);
        
        if (saveResult) {
            if (ipInput) showSuccess(ipInput, "IP information tracked and saved successfully!");
        } else {
            if (ipInput) showError(ipInput, "IP tracking succeeded but saving failed. Information not saved.");
        }
        
    } catch (error) {
        if (ipInput) showError(ipInput, "An error occurred while processing your request. Please try again.");
        console.error('Error:', error);
    }
};

// Handling form submission event
const ipForm = document.getElementById("ipForm");
if (ipForm) {
    ipForm.addEventListener("submit", handleFormData);
}

// Event listener for IP input changes
const ipField = document.getElementById("ip");
if (ipField) {
    ipField.addEventListener("input", function() {
        const ip = this.value.trim();
        clearMessages();
        
        // Validate IP as user types
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Pattern = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
        
        if (ip && !ipv4Pattern.test(ip) && !ipv6Pattern.test(ip)) {
            showError(this, "Please enter a valid IP address");
        }
    });
}

// Setup refresh button
const refreshButton = document.getElementById("refreshButton");
if (refreshButton) {
    refreshButton.addEventListener("click", async () => {
        const ip = await getCurrentIP();
        if (ip) {
            // Create and dispatch submit event
            const event = new Event('submit', { bubbles: true, cancelable: true });
            if (ipForm) ipForm.dispatchEvent(event);
        }
    });
}

// Debug function to test all components
async function debugSystem() {
    console.groupCollapsed("System Debug");
    
    // Test 1: File storage
    try {
        console.log("Testing file storage...");
        const saveTest = await saveIP("8.8.8.8");
        console.log("Save test result:", saveTest ? "Success" : "Failed");
    } catch (e) {
        console.error("Save test failed:", e);
    }
    
    // Test 2: IP lookup
    try {
        console.log("Testing IP lookup...");
        const ipInfo = await getIPInfo("8.8.8.8");
        console.log("IP lookup result:", ipInfo);
    } catch (e) {
        console.error("IP lookup failed:", e);
    }
    
    // Test 3: Current IP
    try {
        console.log("Testing current IP detection...");
        const currentIP = await getCurrentIP();
        console.log("Current IP:", currentIP);
    } catch (e) {
        console.error("Current IP failed:", e);
    }
    
    console.groupEnd();
}

// Run debug when page loads
setTimeout(debugSystem, 3000);