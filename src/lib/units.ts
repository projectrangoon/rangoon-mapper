export const KM_TO_MILES = 0.621371;
export const KM_TO_FEET = 3280.84;

export const formatImperialDistance = (distanceKm: number): string => `${(distanceKm * KM_TO_MILES).toFixed(2)} mi`;

export const formatImperialWalkDistance = (distanceKm: number): string => {
  const distanceMiles = distanceKm * KM_TO_MILES;
  if (distanceMiles < 0.1) {
    return `${Math.round(distanceKm * KM_TO_FEET)} ft`;
  }

  return `${distanceMiles.toFixed(2)} mi`;
};
