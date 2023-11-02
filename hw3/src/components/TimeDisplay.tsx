"use client"

type TimeDisplayProps = {
  timestart: number;
  timeend: number;
};

export default function TimeDisplay({
  timestart,
  timeend
}: TimeDisplayProps){

  function padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }
  
  function dateInYyyyMmDdHh(time: number) {
    const timeDate = new Date(time);
    const result = [
                      timeDate.getFullYear(),
                      padTwoDigits(timeDate.getMonth() + 1),
                      padTwoDigits(timeDate.getDate()),
                   ].join("-") + " " + padTwoDigits(timeDate.getHours());
    return result;
  }
  
  return (
    <h3>From {dateInYyyyMmDdHh(timestart)} to {dateInYyyyMmDdHh(timeend)}</h3>
  )
}