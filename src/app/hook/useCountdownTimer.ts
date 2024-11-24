import { useEffect, useState } from "react";
import { parseISO, isBefore, isAfter } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface CountdownState {
  countdown: string; // Formatted countdown time (e.g., "00:00:00:00")
  status: "beforeStart" | "during" | "afterEnd"; // Current state of the timer
}

const useCountdownTimer = (
  startDate: string,
  endDate: string,
  timezone: string = "Asia/Bangkok"
) => {
  const [state, setState] = useState<CountdownState>({
    countdown: "00:00:00:00",
    status: "beforeStart",
  });

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time); // Add leading zero

  const calculateTimeLeft = (target: Date): string => {
    const now = toZonedTime(new Date(), timezone);
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) return "00:00:00:00";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${formatTime(days)}:${formatTime(hours)}:${formatTime(
      minutes
    )}:${formatTime(seconds)}`;
  };

  useEffect(() => {
    const start = toZonedTime(parseISO(startDate), timezone);
    const end = toZonedTime(parseISO(endDate), timezone);

    const timer = setInterval(() => {
      const now = toZonedTime(new Date(), timezone);

      if (isBefore(now, start)) {
        setState({
          countdown: calculateTimeLeft(start),
          status: "beforeStart",
        });
      } else if (isAfter(now, start) && isBefore(now, end)) {
        setState({
          countdown: calculateTimeLeft(end),
          status: "during",
        });
      } else {
        setState({
          countdown: "00:00:00:00",
          status: "afterEnd",
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate, timezone]);

  return state;
};

export default useCountdownTimer;
