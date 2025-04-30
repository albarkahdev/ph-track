function showTimeTracker() {
  // Save the original body content (in case we want to restore it later)
  const originalContent = document.body.innerHTML;

  // Create warning UI elements
  const timeTrackerContainer = document.createElement('div');
  timeTrackerContainer.className = 'ph-track-time-container';

  // Set the warning HTML
  timeTrackerContainer.innerHTML = `
    <div class="container">
      <div class="header">
        <div class="header-icon">
          <svg class="clock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h1 class="header-title">Time Tracker</h1>
      </div>

      <div class="stat-card">
        <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="stat-label">Total Time In</div>
        <p class="stat-value" id="total-hours">-</p>
      </div>

      <div class="stat-card">
        <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="stat-label">Last Entry</div>
        <p class="stat-value" id="last-entry">-</p>
      </div>

      <div class="stat-card">
        <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 8V6C14 4.89543 13.1046 4 12 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H12C13.1046 20 14 19.1046 14 18V16M10 12H21M21 12L18 9M21 12L18 15"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="stat-label">Exit Times</div>
        <div class="exit-times">
          <div class="exit-time">
            <div class="exit-time-label">After 4 Hours</div>
            <div class="exit-time-value" id="exit-4h">-</div>
          </div>
          <div class="exit-time">
            <div class="exit-time-label">After 6 Hours</div>
            <div class="exit-time-value" id="exit-6h">-</div>
          </div>
        </div>
      </div>
    </div>

    <button id="calculateButton" class="calculate-button">Calculate 4 & 6 Hour Marks</button>

    <div class="credit">Made with ❤️ by <a href="https://github.com/albarkahdev" target="_blank">albarkahdev</a></div>
  `;

  // Clear current body content and add warning
  document.body.innerHTML = '';
  document.body.appendChild(timeTrackerContainer);


  // Add styles to the page
  const style = document.createElement('style');
  style.textContent = `
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      width: 300px;
      padding: 16px;
      margin: 0;
      background-color: #f9fafb;
      color: #1f2937;
    }

    .container {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-icon {
      width: 32px;
      height: 32px;
      background-color: #4f46e5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .stat-card {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      position: relative;
    }

    .stat-card:last-child {
      margin-bottom: 0;
    }

    .calculate-button {
      width: 100%;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
      transition: background-color 0.2s;
    }

    .calculate-button:hover {
      background-color: #4338ca;
    }

    .calculate-button:active {
      background-color: #3730a3;
    }

    .calculating {
      position: relative;
      overflow: hidden;
    }

    .calculating::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.3);
      animation: pulse 0.3s ease;
    }

    @keyframes pulse {
      0% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }

    .credit {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 12px;
      font-weight: 500;
    }

    .stat-label {
      color: #6b7280;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .exit-times {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
    }

    .exit-time {
      text-align: center;
      flex: 1;
    }

    .exit-time:first-child {
      border-right: 1px solid #e5e7eb;
    }

    .exit-time-label {
      font-size: 10px;
      color: #6b7280;
    }

    .exit-time-value {
      font-size: 14px;
      font-weight: 600;
      color: #059669;
    }

    .clock-icon {
      color: white;
    }

    .stat-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      color: #9ca3af;
    }
  `;
  document.head.appendChild(style);

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "open-today-swipe-detail" }, () => {
      if (chrome.runtime.lastError) {
          console.warn("Message failed:", chrome.runtime.lastError.message);
          return;
      }
    });
  });

  const calculateButton = document.getElementById('calculateButton');

  calculateButton.addEventListener('click', () => {
    // Send message to content script to calculate entry-exit times
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: "action-load-time" }, (response) => {

        if (chrome.runtime.lastError) {
            console.warn("Message failed:", chrome.runtime.lastError.message);
            return;
        }
  
        if (response) {
          const {
            canLeaveAt4Hours,
            canLeaveAt6Hours,
            totalHoursSoFar,
            lastEntry
          } = response;

          const div4h = document.getElementById('exit-4h');
          const div6h = document.getElementById('exit-6h');
          const divTotalHours = document.getElementById('total-hours');
          const divLastEntry = document.getElementById('last-entry');

          div4h.textContent = canLeaveAt4Hours;
          div6h.textContent = canLeaveAt6Hours;
          divTotalHours.textContent = `${totalHoursSoFar} hours`
          divLastEntry.textContent = lastEntry
        }
        // else {
        //   resultDiv.textContent = "Could not calculate the times.";
        // }
      });
    });
  });
}

function showWarningUI() {
  // Create warning UI elements
  const warningContainer = document.createElement('div');
  warningContainer.className = 'ph-track-warning-container';

  // Set the warning HTML
  warningContainer.innerHTML = `
    <div class="ph-track-warning">
      <div class="ph-track-warning-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17H12.01M6.18007 19.4001L3.2 12L6.18007 4.60005C6.34007 4.2545 6.61941 3.969 6.96549 3.78557C7.31158 3.60214 7.70961 3.5289 8.10002 3.58005L16.5 5.00005C16.8904 5.0512 17.2539 5.22621 17.531 5.50328C17.8081 5.78035 17.9831 6.14392 18.0342 6.53432L19.4542 14.9343C19.5054 15.3247 19.4321 15.7228 19.2487 16.0688C19.0653 16.4149 18.7798 16.6943 18.4342 16.8543L11.0342 19.8401C10.6887 20.0001 10.2991 20.045 9.92924 19.9679C9.55933 19.8907 9.23209 19.6957 9 19.4143L6.18007 19.4001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1>Extension Limited</h1>
      <p>This extension only works on ph-track.</p>
      <div class="ph-track-credit">Made with ❤️ by <a href="https://github.com/albarkahdev" target="_blank">albarkahdev</a></div>
    </div>
  `;

  // Clear current body content and add warning
  document.body.innerHTML = '';
  document.body.appendChild(warningContainer);

  // Add styles to the page
  const style = document.createElement('style');
  style.textContent = `
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f9fafb;
    }
    
    .ph-track-warning-container {
      width: 100%;
      max-width: 500px;
      padding: 20px;
    }
    
    .ph-track-warning {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 30px;
      text-align: center;
      border: 1px solid #c7d2fe;
    }
    
    .ph-track-warning-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      color: #4f46e5;
    }
    
    .ph-track-warning h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 15px 0;
      color: #000;
    }
    
    .ph-track-warning p {
      font-size: 16px;
      color: #000;
      margin: 0 0 25px 0;
      line-height: 1.5;
    }
    
    #ph-track-goto-site {
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    #ph-track-goto-site:hover {
      background-color: #4338ca;
    }
    
    .ph-track-credit {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 20px;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const currentUrl = tab.url;

    if (currentUrl.includes('photontrack')) {
      showTimeTracker();
    } else {
      showWarningUI();
    }
  });

});
