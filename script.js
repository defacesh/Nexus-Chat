/**
 * Nexus Global Chat Engine
 * English comments for global development standards
 */

// --- AUTO-RESIZE & UI LAYOUT ---

/**
 * Handles the dynamic height of the message textarea and adjusts chat padding
 * @param {HTMLElement} textarea - The input element to resize
 */
function autoResize(textarea) {
  // Reset height to calculate scrollHeight correctly
  textarea.style.height = "auto";
  // Set height based on content, capped at 200px
  const newHeight = Math.min(textarea.scrollHeight, 200);
  textarea.style.height = `${newHeight}px`;

  // Dynamically update chat-area padding to prevent message overlap with input
  const chatArea = document.getElementById("chat-area");
  if (chatArea) {
    chatArea.style.paddingBottom = `${textarea.clientHeight + 40}px`;
  }

  scrollToBottom();
}

/**
 * Smoothly scrolls the chat area to the latest message
 */
function scrollToBottom() {
  const chatArea = document.getElementById("chat-area");
  if (chatArea) {
    // Using requestAnimationFrame for performance-friendly scrolling
    requestAnimationFrame(() => {
      chatArea.scrollTop = chatArea.scrollHeight;
    });
  }
}

// --- MESSAGE HANDLING ---

/**
 * Simulates sending a message and injecting it into the DOM
 * @param {string} text - Message content
 */
function sendMessage(text) {
  const chatArea = document.getElementById("chat-area");
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const messageHTML = `
    <div class="message-container" style="animation: fadeIn 0.3s ease forwards;">
      <div class="profile-photo"></div>
      <div class="message-content">
        <div class="message-header">
          <h4 class="username" style="color: #2fff97;">You</h4>
          <h5 class="time">${time}</h5>
        </div>
        <div class="message"><pre>${text}</pre></div>
      </div>
    </div>
  `;
  
  chatArea.insertAdjacentHTML('beforeend', messageHTML);
}

// --- EVENT LISTENERS ---

window.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("message-input");
  const chatArea = document.getElementById("chat-area");

  // Initial UI Setup
  if (textarea && chatArea) {
    chatArea.style.paddingBottom = `${textarea.clientHeight + 20}px`;
    scrollToBottom();
  }

  // Handle Enter Key for sending messages
  textarea?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = textarea.value.trim();
      if (text !== "") {
        sendMessage(text);
        textarea.value = "";
        autoResize(textarea);
      }
    }
  });

  // Handle Channel Switching Visuals
  document.querySelectorAll(".channel").forEach(channel => {
    channel.addEventListener("click", function() {
      document.querySelector(".channel.active")?.classList.remove("active");
      this.classList.add("active");
      console.log(`Switched to: ${this.innerText}`);
    });
  });

  updateUserCounts();
  initConnectionMonitor();
});

// --- USER MANAGEMENT ---

/**
 * Scans the member list and updates the status counts in the UI
 */
function updateUserCounts() {
  const onlineUsers = document.querySelectorAll(".user-item.online").length;
  const offlineUsers = document.querySelectorAll(".user-item.offline").length;

  const countElements = document.querySelectorAll(".user-category h3 .user-count");
  if (countElements.length >= 2) {
    countElements[0].textContent = `(${onlineUsers})`;
    countElements[1].textContent = `(${offlineUsers})`;
  }
}

// --- SYSTEM MONITORS ---

/**
 * Observes the chat area for any new elements to trigger auto-scroll
 */
const observer = new MutationObserver(() => {
  scrollToBottom();
});

const chatAreaTarget = document.getElementById("chat-area");
if (chatAreaTarget) {
  observer.observe(chatAreaTarget, { childList: true, subtree: true });
}

/**
 * Monitors network connection status and notifies the user
 */
function initConnectionMonitor() {
  window.addEventListener('offline', () => {
    console.warn("Nexus: Connection lost.");
    document.querySelector(".top-container h3").textContent = "Nexus (Offline Mode)";
  });

  window.addEventListener('online', () => {
    console.info("Nexus: Connection restored.");
    document.querySelector(".top-container h3").textContent = "Nexus Network";
  });
}

// --- GLOBAL THEME LOADER ---
function applySavedTheme() {
    const savedColor = localStorage.getItem('accentColor') || '#2fff97';
    const savedTheme = localStorage.getItem('appTheme') || 'dark';

    // Apply Accent Color to CSS Variable
    document.documentElement.style.setProperty('--accent-color', savedColor);
    
    // Apply Dark/Light Mode
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    // Dynamic style injection for existing elements
    const style = document.createElement('style');
    style.innerHTML = `
        .server-item.active, .channel.active, .save-btn, .nav-button.active { 
            background-color: ${savedColor} !important; 
        }
        .username, .material-icons:hover { 
            color: ${savedColor}; 
        }
    `;
    document.head.appendChild(style);
}

// Run immediately
applySavedTheme();

