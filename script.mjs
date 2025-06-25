// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.


import { getUserIDs, getListenEvents, getSong } from './data.mjs';

// Get references to DOM elements
const userSelect = document.getElementById('user-select');
const resultsDiv = document.getElementById('results');


// Populates the user selection dropdown with available user IDs.
 
function populateUserDropdown() {
    const userIDs = getUserIDs();
    userIDs.forEach(userID => {
        const option = document.createElement('option');
        option.value = userID;
        option.textContent = `User ${userID}`; 
        userSelect.appendChild(option);
    });
}

populateUserDropdown();

// populate result for the select user

function renderResults(userID) {
    // Clear previous results
    resultsDiv.innerHTML = '';

    const listenEvents = getListenEvents(userID);

    if (listenEvents.length === 0) {
        resultsDiv.innerHTML = '<p>This user didn’t listen to any songs.</p>';
        return;
    }
}


// Attach event listener to the dropdown
userSelect.addEventListener('change', () => {
    const selectedUserID = userSelect.value;
    renderResults(selectedUserID);
    
    if (!selectedUserID) return;
        
    
});


