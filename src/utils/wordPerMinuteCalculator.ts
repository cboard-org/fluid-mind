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
    const newStartTime = performance.now();
    return createWpmCalculator(newStartTime, finishTime);
  };

  const finish = (): Timer => {
    const newFinishTime = performance.now();
    return createWpmCalculator(startTime, newFinishTime);
  };

  const calculateWpm = (text: string): number => {
    if (startTime === null || finishTime === null) {
      console.log('ERROR: Timer not started or finished');
      return 0;
    }
    if (!text.trim()) {
      console.log('ERROR: Text is empty');
      return 0;
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
