type Timer = {
  start: () => Timer;
  finish: () => Timer;
  calculateWpm: (text: string) => number;
  calculateAvearageWpm: () => number;
};

const averageWPM: number[] = [];
export function createWpmCalculator(
  startTime: number | null = null,
  finishTime: number | null = null,
): Timer {
  const start = (): Timer => {
    const newStartTime = new Date().getTime();
    return createWpmCalculator(newStartTime, finishTime); // return new instance with updated startTime
  };

  const finish = (): Timer => {
    const newFinishTime = new Date().getTime();
    return createWpmCalculator(startTime, newFinishTime); // return new instance with updated finishTime
  };

  const calculateWpm = (text: string): number => {
    if (startTime === null || finishTime === null) {
      console.log('ERROR: Timer not started or finished');
      return 0;
      //throw new Error("Timer not started or finished");
    }
    if (!text.trim()) {
      console.log('ERROR: Text is empty');
      return 0;
      //throw new Error('ERROR with text');
    }

    const numWords = text.trim().split(/\s+/).length;
    const elapsedTime = (finishTime - startTime) / 1000;
    const wpm = (numWords / elapsedTime) * 60;
    const rounded = Math.round(wpm);
    averageWPM.push(rounded);
    return rounded;
  };

  const calculateAvearageWpm = (): number => {
    const sum = averageWPM.reduce((a, b) => a + b, 0);
    console.log('averageWPM', averageWPM);
    const average = sum / averageWPM.length;
    return average;
  };

  return { start, finish, calculateWpm, calculateAvearageWpm };
}
