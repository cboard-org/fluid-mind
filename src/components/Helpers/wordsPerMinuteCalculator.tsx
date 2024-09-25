export class WordPerMinuteCalculator {
  private startTime: number | null;
  private finishTime: number | null;
  private wpmHistory: number[] = [];

  constructor() {
    this.startTime = null;
    this.finishTime = null;
  }

  startTimer(): void {
    this.startTime = new Date().getTime();
  }

  finishTimer(): void {
    this.finishTime = new Date().getTime();
  }

  calculateWpm(text: string): number {
    if (this.startTime === null || this.finishTime === null) {
      throw new Error("Timer not started or finished");
    }
    if (!text.trim()) {
        throw new Error('ERROR with text');
    }
    const numWords = text.trim().split(/\s+/).length;
    const elapsedTime = (this.finishTime - this.startTime) / 1000;
    const wpm = numWords / elapsedTime * 60;
    this.wpmHistory.push(wpm); // store WPM in array
    return Math.round(wpm);
  }
  
  calculateAverageWpm(): number {
    if (this.wpmHistory.length === 0) {
      throw new Error("No WPM data available");
    }
    const sum = this.wpmHistory.reduce((a, b) => a + b, 0);
    return sum / this.wpmHistory.length;
  }
}