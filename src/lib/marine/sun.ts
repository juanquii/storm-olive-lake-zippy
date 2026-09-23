function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** USNO approximation. Good for a return time, not a survey. */
export function sunTimes(day: Date, lat: number, lng: number): { rise: Date; set: Date } | null {
  const rise = event(day, lat, lng, true);
  const set = event(day, lat, lng, false);
  if (!rise || !set) return null;
  return { rise, set };
}

function event(day: Date, lat: number, lng: number, rising: boolean): Date | null {
  const year = day.getFullYear();
  const month = day.getMonth() + 1;
  const date = day.getDate();
  const n1 = Math.floor((275 * month) / 9);
  const n2 = Math.floor((month + 9) / 12);
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const n = n1 - n2 * n3 + date - 30;
  const lngHour = lng / 15;
  const t = rising ? n + (6 - lngHour) / 24 : n + (18 - lngHour) / 24;
  const mean = 0.9856 * t - 3.289;
  let lon = mean + 1.916 * Math.sin(toRad(mean)) + 0.02 * Math.sin(toRad(2 * mean)) + 282.634;
  lon = (lon + 360) % 360;
  let ra = toDeg(Math.atan(0.91764 * Math.tan(toRad(lon))));
  ra = (ra + 360) % 360;
  const lq = Math.floor(lon / 90) * 90;
  const rq = Math.floor(ra / 90) * 90;
  ra = (ra + (lq - rq)) / 15;
  const sinDec = 0.39782 * Math.sin(toRad(lon));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(toRad(90.833)) - sinDec * Math.sin(toRad(lat))) / (cosDec * Math.cos(toRad(lat)));
  if (cosH > 1 || cosH < -1) return null;
  const hourAngle = (rising ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH))) / 15;
  let ut = (hourAngle + ra - 0.06571 * t - 6.622 - lngHour) % 24;
  if (ut < 0) ut += 24;
  const hours = Math.floor(ut);
  const minutes = Math.floor((ut - hours) * 60);
  return new Date(Date.UTC(year, month - 1, date, hours, minutes));
}
