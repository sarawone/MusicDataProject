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

