mport { getFridayNightListens } from './common.mjs';

test('filters Friday night listens correctly', () => {
  const events = [
    { timestamp: '2024-08-02T17:00:00Z' }, // Friday 5 PM UTC
    { timestamp: '2024-08-02T16:59:59Z' }, // Friday before 5 PM UTC
    { timestamp: '2024-08-03T03:59:59Z' }, // Saturday 3:59 AM UTC
    { timestamp: '2024-08-03T04:00:00Z' }  // Saturday 4 AM UTC
  ];

  const filtered = getFridayNightListens(events);

  expect(filtered).toEqual([
    { timestamp: '2024-08-02T17:00:00Z' },
    { timestamp: '2024-08-03T03:59:59Z' }
  ]);
});
