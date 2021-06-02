export default function getMinutes(date: Date): number {
    const currentDate:Date = new Date()
    const TO_HOURS = 1000 * 60
    return (currentDate.valueOf() - date.valueOf())/TO_HOURS
  }
