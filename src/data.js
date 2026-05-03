/**
 * UI defaults only. All report content comes from `/reports.json` (written by the agent).
 * When the bundle omits `user`, the app uses this object for the sidebar greeting and counters.
 */
export const DEFAULT_USER = {
  name: "Tom",
  bookmarkedIds: [],
  readThisWeek: 0,
  readThisMonth: 0,
  topicsCovered: [],
};
