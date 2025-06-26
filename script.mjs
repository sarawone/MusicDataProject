// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.


import { getUserIDs, getListenEvents, getSong } from './data.mjs';
import {userSelect,resultsDiv} from './domelement.mjs';
import { getEveryDaySongs,displayResult,getMostListened,getFridayNightListens,getLongestStreakSong} from './common.mjs';

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
    
    // Use a definition list for semantic grouping of questions and answers
    const dl = document.createElement('dl');
    resultsDiv.appendChild(dl);
    
    // Q1: Most often listened to song (count)
    displayResult('most-listened-song-count',"What was the user’s most often listened to song?",
            getMostListened(listenEvents, 'song', false)
        );

     // Q2: Most often listened to artist (count)
    displayResult('most-listened-artist-count',"What was the user’s most often listened to artist?",
            getMostListened(listenEvents, 'artist', false)
        );

    // Filter for Friday night listens
    const fridayNightEvents = getFridayNightListens(listenEvents);

    // Q3: Most often listened to song on Friday nights (count)
    displayResult('friday-night-song-count',"What was the user’s most often listened to song on Friday nights (between 5pm and 4am)?",
        getMostListened(fridayNightEvents, 'song', false)
    );

        // Q4 (cont.): Most often listened to artist (time)
        displayResult('most-listened-artist-time',
            "What was the user’s most often listened to artist (by listening time)?",
            getMostListened(listenEvents, 'artist', true)
        );
    
        // Q4 (cont.): Most often listened to song on Friday nights (time)
        displayResult('friday-night-song-time',
            "What was the user’s most often listened to song on Friday nights (between 5pm and 4am, by listening time)?",
            getMostListened(fridayNightEvents, 'song', true)
        );
    
        // Q5: Longest streak song
        displayResult('longest-streak-song',
            "What song did the user listen to the most times in a row? How many times was it listened to?",
            getLongestStreakSong(listenEvents)
        );
    
        // Q6: Every day songs
        displayResult('every-day-songs',
            "Are there any songs that, on each day the user listened to music, they listened to every day? If yes, show which one(s).",
            getEveryDaySongs(listenEvents)
        );


        // Q7: Top three genres
        const topGenresResult = getTopGenres(listenEvents);
        if (topGenresResult) {
        // We handle the dynamic "Top X genres" text inside getTopGenres
        const [title, genresList] = topGenresResult.split(': ');
        displayResult('top-genres', title + ':', genresList);
    }

    

    
}


// Attach event listener to the dropdown
userSelect.addEventListener('change', () => {
    const selectedUserID = userSelect.value;
    renderResults(selectedUserID);
    
    if (!selectedUserID) return;
        
    
});



