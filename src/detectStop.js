import moment from 'moment';

export const parseData = (data) => {
  return data.map((entry) => ({
    latitude: parseFloat(entry.latitude),
    longitude: parseFloat(entry.longitude),
    timestamp: new Date(Number(entry.eventGeneratedTime)),
    speed: parseInt(entry.speed, 10),
  }));
};

export const detectStoppages = (gpsData, stoppageThreshold) => {
  const stoppages = [];
  let currentStoppage = null;

  for (let i = 1; i < gpsData.length; i++) {
    const prevPoint = gpsData[i - 1];
    const currPoint = gpsData[i];

    if (currPoint.speed === 0) {
      if (!currentStoppage) {
        currentStoppage = {
          start: prevPoint.timestamp,
          location: { lat: currPoint.latitude, lng: currPoint.longitude },
        };
      }
    } else {
      if (currentStoppage) {
        currentStoppage.end = prevPoint.timestamp;
        const duration = moment.duration(moment(currentStoppage.end).diff(moment(currentStoppage.start))).asMinutes();
        if (duration >= stoppageThreshold) {
          stoppages.push({ ...currentStoppage, duration });
        }
        currentStoppage = null;
      }
    }
  }

  // Handle the last stoppage if it exists
  if (currentStoppage) {
    currentStoppage.end = gpsData[gpsData.length - 1].timestamp;
    const duration = moment.duration(moment(currentStoppage.end).diff(moment(currentStoppage.start))).asMinutes();
    if (duration >= stoppageThreshold) {
      stoppages.push({ ...currentStoppage, duration });
    }
  }

  return stoppages;
};