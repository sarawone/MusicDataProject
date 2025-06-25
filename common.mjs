import {resultsDiv} from './domelement.mjs';

export function displayResult(questionTitle, questionText, answerText) {
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
