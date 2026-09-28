import {
  MOCK_USER_SUMMARY,
  MOCK_FAVORITE_FANDOMS,
  MOCK_CONTINUE_EXPLORING,
  MOCK_SAVED_ORBIT,
  MOCK_RECENT_ACTIVITY,
  MOCK_UPCOMING_EVENTS,
} from '../data/dashboardData.js';

/**
 * Service function to retrieve personal user summary and metadata.
 * Ready for future REST API integration (e.g. GET /api/v1/user/summary).
 */
export async function getUserSummary() {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return { ...MOCK_USER_SUMMARY };
}

/**
 * Service function to retrieve user's favorite fandoms.
 * Ready for future REST API integration (e.g. GET /api/v1/user/fandoms).
 */
export async function getFavoriteFandoms() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...MOCK_FAVORITE_FANDOMS];
}

/**
 * Service function to retrieve content recommendations for "Continue Exploring".
 * Ready for future REST API integration (e.g. GET /api/v1/dashboard/recommendations).
 */
export async function getDashboardRecommendations() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...MOCK_CONTINUE_EXPLORING];
}

/**
 * Service function to retrieve recent user activity timeline items.
 * Ready for future REST API integration (e.g. GET /api/v1/user/activity).
 */
export async function getRecentActivity() {
  await new Promise((resolve) => setTimeout(resolve, 160));
  return [...MOCK_RECENT_ACTIVITY];
}

/**
 * Service function to retrieve recent saved items preview.
 * Ready for future REST API integration (e.g. GET /api/v1/user/saved/preview).
 */
export async function getSavedPreview() {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return [...MOCK_SAVED_ORBIT];
}

/**
 * Service function to retrieve upcoming events preview.
 * Ready for future REST API integration (e.g. GET /api/v1/events/upcoming).
 */
export async function getUpcomingEvents() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...MOCK_UPCOMING_EVENTS];
}
