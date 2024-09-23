export class WordPerMinuteCalculator {
  private startTime: number | null;
  private finishTime: number | null;

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
    return Math.round(wpm);
  }
}