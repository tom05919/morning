// Design prototype only — no sample reports. Use the Vite app + public/reports.json for real data.
const REPORTS = [];

const USER = {
  name: "Tom",
  bookmarkedIds: [],
  readThisWeek: 0,
  readThisMonth: 0,
  topicsCovered: [],
};

window.REPORTS = REPORTS;
window.USER = USER;
