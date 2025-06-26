
import { getMostListened } from './common.mjs';

// Mock getSong
jest.unstable_mockModule('./data.mjs', () => ({
  getSong: (songID) => {
    const songs = {
      'song-1': { title: 'Song One', artist: 'Artist A', duration: 200 },
      'song-2': { title: 'Song Two', artist: 'Artist B', duration: 180 }
    };
    return songs[songID] || null;
  }
}));

const { getSong } = await import('./data.mjs');

describe('getMostListened', () => {
  test('returns most listened song by count', () => {
    const listenEvents = [
      { songID: 'song-1' },
      { songID: 'song-1' },
      { songID: 'song-2' },
      { songID: 'song-1' }
    ];

    const result = getMostListened(listenEvents, 'song', false);
    expect(result).toBe('Song One - Artist A');
  });
});