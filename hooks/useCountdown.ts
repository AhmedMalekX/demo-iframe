import { useEffect, useState } from "react";

type UseCountdownReturn = [number, () => void, () => void]; // Add stop function to the return type

export const useCountdown = (initialTime: number = 60): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  let intervalId: NodeJS.Timeout | null = null;

  const startCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId); // Clear any existing interval before starting a new one
    }
    setTimeLeft(initialTime);
    intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const stopCountdown = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return [timeLeft, startCountdown, stopCountdown];
};
