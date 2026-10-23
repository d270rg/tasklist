import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

const dateFormat = new Intl.DurationFormat("en-US", { style: "long" });

export function TimeLeft({ deadline }: { deadline: Date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const timeLeft = now - deadline.getTime();
  const timeInterval = intervalToDuration({
    start: now,
    end: deadline.getTime(),
  });
  const timeLabel = dateFormat.format(timeInterval);

  return <div>{timeLeft >= 0 ? timeLabel : `Expired ${timeLabel} ago`}</div>;
}
