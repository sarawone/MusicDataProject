import {resultsDiv} from './domelement.mjs';
import { getSong } from './data.mjs';

export function displayResult(questionId, questionText, answerText) {
    // If there's no answer, we don't display the question at all.
    if (!answerText) {
        return;
    }

    // Create a definition list item for the question and answer
    const dt = document.createElement('dt');
    dt.setAttribute('id', questionId + '-question'); // Add ID for accessibility/testing
    dt.textContent = questionText;

    const dd = document.createElement('dd');
    dd.setAttribute('id', questionId + '-answer'); // Add ID for accessibility/testing
    dd.textContent = answerText;

    // Append to the results display area
    resultsDiv.appendChild(dt);
    resultsDiv.appendChild(dd);
}


/**
 * Calculates the most listened song or artist based on count or time.
 * @param {Array<Object>} events - Filtered listen events.
 * @param {string} type - 'song' or 'artist'.
 * @param {boolean} byTime - True if calculating by play duration, false for count.
 * @returns {string|null} The most listened song/artist and count/time, or null if no data.
 */

export function getMostListened(events, type, byTime) {
    if (events.length === 0) {
        return null;
    }

    const counts = new Map(); // Stores counts or total durations

    events.forEach(event => {
        const song = getSong(event.song_id);
        if (!song) return; // Skip if song data is missing

        let key;
        let value = byTime ? song.duration_seconds : 1;

        if (type === 'song') {
            key = `${song.title} - ${song.artist}`;
        } else if (type === 'artist') {
            key = song.artist;
        } else {
            return null; // Invalid type
        }

        counts.set(key, (counts.get(key) || 0) + value);
    });

    if (counts.size === 0) {
        return null;
    }

    // Find the item with the maximum count/duration
    let mostListenedItem = null;
    let maxCount = -1;

    for (const [item, count] of counts.entries()) {
        if (count > maxCount) {
            maxCount = count;
            mostListenedItem = item;
        }
    }

    if (mostListenedItem === null) {
        return null; // Should not happen if counts.size > 0
    }

    return `${mostListenedItem}`;
}


/**
 * Filters listen events for Friday nights (5 PM Friday to 4 AM Saturday).
 * @param {Array<Object>} events - The listen events for a user.
 * @returns {Array<Object>} Filtered listen events.
 */
export function getFridayNightListens(events) {
    return events.filter(event => {
        const date = new Date(event.timestamp);
        const dayOfWeek = date.getUTCDay(); // 0 for Sunday, 5 for Friday, 6 for Saturday
        const hour = date.getUTCHours(); // UTC hour (0-23)

        // Friday from 5 PM UTC (17) onwards
        if (dayOfWeek === 5 && hour >= 17) {
            return true;
        }
        // Saturday from midnight (0) to 4 AM UTC (exclusive of 4:00:00)
        if (dayOfWeek === 6 && hour >= 0 && hour < 4) {
            return true;
        }
        return false;
    });
}

/**
 * Calculates the song listened to the most times in a row.
 * @param {Array<Object>} events - The listen events for a user.
 * @returns {string|null} The song and its streak length, or null if no streak.
 */
export function getLongestStreakSong(events) {
    if (events.length === 0) {
        return null;
    }

    let maxStreak = 0;
    let currentStreak = 0;
    let longestStreakSongId = null;
    let currentSongId = null;

    let longestStreakSongs = []; // To handle ties

    events.forEach(event => {
        if (event.song_id === currentSongId) {
            currentStreak++;
        } else {
            // Check if the previous streak was the longest
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
                longestStreakSongs = [{ song_id: currentSongId, count: maxStreak }];
            } else if (currentStreak === maxStreak && maxStreak > 0) {
                // If there's a tie, add to the list
                longestStreakSongs.push({ song_id: currentSongId, count: maxStreak });
            }
            currentSongId = event.song_id;
            currentStreak = 1; // Start new streak
        }
    });

    // Check the last streak after loop finishes
    if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        longestStreakSongs = [{ song_id: currentSongId, count: maxStreak }];
    } else if (currentStreak === maxStreak && maxStreak > 0) {
        longestStreakSongs.push({ song_id: currentSongId, count: maxStreak });
    }

    if (maxStreak === 0) { // No songs listened to or no streak
        return null;
    }

    // Format the output for ties
    if (longestStreakSongs.length > 1) {
        const uniqueTitles = new Set();
        const formattedTies = longestStreakSongs
            .filter(item => {
                const song = getSong(item.song_id);
                const fullTitle = song ? `${song.title} - ${song.artist}` : 'Unknown Song';
                if (!uniqueTitles.has(fullTitle)) {
                    uniqueTitles.add(fullTitle);
                    return true;
                }
                return false;
            })
            .map(item => {
                const song = getSong(item.song_id);
                return song ? `${song.title} - ${song.artist}` : 'Unknown Song';
            });
        return `Multiple songs tied with length ${maxStreak}: ${formattedTies.join(', ')}`;
    } else if (longestStreakSongs.length === 1) {
        const song = getSong(longestStreakSongs[0].song_id);
        return song ? `${song.title} - ${song.artist} (length: ${maxStreak})` : 'Unknown Song (length: ${maxStreak})';
    }

    return null;
}

