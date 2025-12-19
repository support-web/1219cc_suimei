declare module 'lunar-javascript' {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getLunar(): Lunar;
    getJieQiTable(): Record<string, Solar>;
    getNextJie(): JieQi | null;
    getPrevJie(): JieQi | null;
    toDate(): Date;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
  }

  export class Lunar {
    getEightChar(): EightChar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
  }

  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}
