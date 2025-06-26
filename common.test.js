// common.test.mjs

// ✅ Step 1: Mock getSong from data.mjs BEFORE importing getMostListened
jest.mock('./data.mjs', () => ({
  getSong: (id) => {
    const songs = {
      'song-1': { title: 'Song A', artist: 'Artist X', duration_seconds: 180 },
      'song-2': { title: 'Song B', artist: 'Artist Y', duration_seconds: 200 },
      'song-3': { title: 'Song C', artist: 'Artist X', duration_seconds: 100 }
    };
    return songs[id];
  }
}));

// ✅ Step 2: Now import your logic function AFTER mock
import { getMostListened } from './common.mjs';

// ✅ Step 3: Write your tests
describe('getMostListened', () => {
  test('returns most listened song by count', () => {
    const events = [
      { song_id: 'song-1' },
      { song_id: 'song-1' },
      { song_id: 'song-2' }
    ];
    const result = getMostListened(events, 'song', false);
    expect(result).toBe('Song A - Artist X');
  });

  test('returns most listened artist by count', () => {
    const events = [
      { song_id: 'song-1' },
      { song_id: 'song-2' },
      { song_id: 'song-3' } // also Artist X
    ];
    const result = getMostListened(events, 'artist', false);
    expect(result).toBe('Artist X');
  });

  test('returns most listened song by time', () => {
    const events = [
      { song_id: 'song-1' }, // 180
      { song_id: 'song-2' }, // 200
      { song_id: 'song-2' }  // 200
    ];
    const result = getMostListened(events, 'song', true);
    expect(result).toBe('Song B - Artist Y');
  });

  test('returns null for empty event list', () => {
    const result = getMostListened([], 'song', false);
    expect(result).toBe(null);
  });

  test('returns null for invalid type', () => {
    const events = [{ song_id: 'song-1' }];
    const result = getMostListened(events, 'invalid-type', false);
    expect(result).toBe(null);
  });
});
