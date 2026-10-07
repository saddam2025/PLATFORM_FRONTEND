import reelService from './reelService';

const trackedReelIds = new Set();
const pendingReelViews = new Map();

export function trackReelViewOnce(reelId) {
  if (trackedReelIds.has(reelId)) return Promise.resolve();
  if (pendingReelViews.has(reelId)) return pendingReelViews.get(reelId);

  const request = reelService.trackView(reelId)
    .then((result) => {
      trackedReelIds.add(reelId);
      return result;
    })
    .finally(() => pendingReelViews.delete(reelId));

  pendingReelViews.set(reelId, request);
  return request;
}
