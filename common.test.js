

// Mock getSong

jest.mock('./data.mjs', () => ({
  getSong: (id) => {
    const songs = {
      'song-1': { title: 'Song A', artist: 'Artist X', duration_seconds: 180 },
      'song-2': { title: 'Song B', artist: 'Artist Y', duration_seconds: 200 }
    };
    return songs[id];
  }
}));

import { getMostListened } from './common.mjs';
test('getMostListened returns most played song by count', () => {
  const mockEvents = [
    { song_id: 'song-1' },
    { song_id: 'song-1' },
    { song_id: 'song-2' }
  ];
  const result = getMostListened(mockEvents, 'song', false);
  expect(result).toBe('Song A - Artist X');
});