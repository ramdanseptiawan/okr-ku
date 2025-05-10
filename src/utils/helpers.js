// Calculate overall progress for an objective based on its key results
// Allow for overachievement (>100%) for individual KRs, but cap objective progress at 100% by default
export const calculateObjectiveProgress = (keyResults, allowOverachievement = false) => {
  if (keyResults.length === 0) return 0;
  
  const totalProgress = keyResults.reduce((sum, kr) => {
    // Calculate individual KR progress, allowing for >100%
    const krProgress = (kr.current / kr.target) * 100;
    return sum + krProgress;
  }, 0);
  
  const avgProgress = Math.round(totalProgress / keyResults.length);
  // Only cap at 100% if overachievement is not allowed
  return allowOverachievement ? avgProgress : Math.min(avgProgress, 100);
};