export const createTimeout = (duration: number, cancellationToken: any) => {
  return new Promise((_, reject) => {
    // let elapsedTime = 0;
    // const intervalId = setInterval(() => {
    //   elapsedTime += 1000;
    //   console.log(`Elapsed time: ${elapsedTime / 1000} seconds`);
    // }, 1000);

    const timeoutId = setTimeout(() => {
      // clearInterval(intervalId);
      if (!cancellationToken.cancelled) {
        reject({
          message:
            'Something went wrong, try again. No credits were deducted for this request.',
        });
      }
    }, duration);
    cancellationToken.timeoutId = timeoutId; // Store the timeoutId in the token
    // cancellationToken.intervalId = intervalId; // Store the intervalId in the token
  });
};
