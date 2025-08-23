import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2025, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2025, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    // TODO: 의문... isLeapYear가 잘못 구현된거면...? 그럼 isLeapYear도 테스트 해야하나...
    if (isLeapYear(2024)) {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    }
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    if (!isLeapYear(2025)) {
      expect(getDaysInMonth(2025, 2)).toBe(28);
    }
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    // 13월은 다음해 1월로 처리됨 (12월 일수와 동일)
    expect(getDaysInMonth(2025, 13)).toBe(31); // 2026년 1월 = 31일
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2025-08-20'); // 수요일
    const expected = [
      new Date('2025-08-17'), // 일요일
      new Date('2025-08-18'), // 월요일
      new Date('2025-08-19'), // 화요일
      new Date('2025-08-20'), // 수요일
      new Date('2025-08-21'), // 목요일
      new Date('2025-08-22'), // 금요일
      new Date('2025-08-23'), // 토요일
    ];
    const result = getWeekDates(date);

    // toEqual은 깊은 비교를 하나보다..
    expect(result).toEqual(expected);
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2025-08-18'); // 월요일
    const expected = [
      new Date('2025-08-17'), // 일요일
      new Date('2025-08-18'), // 월요일
      new Date('2025-08-19'), // 화요일
      new Date('2025-08-20'), // 수요일
      new Date('2025-08-21'), // 목요일
      new Date('2025-08-22'), // 금요일
      new Date('2025-08-23'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2025-08-17'); // 일요일
    const expected = [
      new Date('2025-08-17'), // 일요일
      new Date('2025-08-18'), // 월요일
      new Date('2025-08-19'), // 화요일
      new Date('2025-08-20'), // 수요일
      new Date('2025-08-21'), // 목요일
      new Date('2025-08-22'), // 금요일
      new Date('2025-08-23'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date('2025-12-31'); // 수요일
    const expected = [
      new Date('2025-12-28'), // 일요일
      new Date('2025-12-29'), // 월요일
      new Date('2025-12-30'), // 화요일
      new Date('2025-12-31'), // 수요일
      new Date('2026-01-01'), // 목요일
      new Date('2026-01-02'), // 금요일
      new Date('2026-01-03'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date('2026-01-01'); // 목요일
    const expected = [
      new Date('2025-12-28'), // 일요일
      new Date('2025-12-29'), // 월요일
      new Date('2025-12-30'), // 화요일
      new Date('2025-12-31'), // 수요일
      new Date('2026-01-01'), // 목요일
      new Date('2026-01-02'), // 금요일
      new Date('2026-01-03'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    // 2024년은 윤달
    const date = new Date('2024-02-29'); // 목요일
    const expected = [
      new Date('2024-02-25'), // 일요일
      new Date('2024-02-26'), // 월요일
      new Date('2024-02-27'), // 화요일
      new Date('2024-02-28'), // 수요일
      new Date('2024-02-29'), // 목요일
      new Date('2024-03-01'), // 금요일
      new Date('2024-03-02'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2025-08-31'); // 일요일
    const expected = [
      new Date('2025-08-31'), // 일요일
      new Date('2025-09-01'), // 월요일
      new Date('2025-09-02'), // 화요일
      new Date('2025-09-03'), // 수요일
      new Date('2025-09-04'), // 목요일
      new Date('2025-09-05'), // 금요일
      new Date('2025-09-06'), // 토요일
    ];
    const result = getWeekDates(date);

    expect(result).toEqual(expected);
  });

});

describe('getWeeksAtMonth', () => {
  it('2025년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {});
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {});

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {});

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {});

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {});
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {});
});

describe('formatMonth', () => {
  it("2025년 7월 10일을 '2025년 7월'로 반환한다", () => {
    const date = new Date('2025-07-10');
    const expected = '2025년 7월';
    const formatted = formatMonth(date);

    expect(formatted).toBe(expected);
  });
});

describe('isDateInRange', () => {
  it('범위 내의 날짜 2025-07-10에 대해 true를 반환한다', () => {
    const date = new Date('2025-07-10');

    const result = isDateInRange(date, new Date('2025-07-01'), new Date('2025-07-31'));
    const expected = true;
    expect(result).toBe(expected);
  });

  it('범위의 시작일 2025-07-01에 대해 true를 반환한다', () => {
    const date = new Date('2025-07-01');

    const result = isDateInRange(date, new Date('2025-07-01'), new Date('2025-07-31'));
    const expected = true;
    expect(result).toBe(expected);
  });

  it('범위의 종료일 2025-07-31에 대해 true를 반환한다', () => {
    const date = new Date('2025-07-31');

    const result = isDateInRange(date, new Date('2025-07-01'), new Date('2025-07-31'));
    const expected = true;
    expect(result).toBe(expected);
  });

  it('범위 이전의 날짜 2025-06-30에 대해 false를 반환한다', () => {
    const date = new Date('2025-06-30');

    const result = isDateInRange(date, new Date('2025-07-01'), new Date('2025-07-31'));
    const expected = false;
    expect(result).toBe(expected);
  });

  it('범위 이후의 날짜 2025-08-01에 대해 false를 반환한다', () => {
    const date = new Date('2025-08-01');

    const result = isDateInRange(date, new Date('2025-07-01'), new Date('2025-07-31'));
    const expected = false;
    expect(result).toBe(expected);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const startDate = new Date('2025-07-31');
    const endDate = new Date('2025-07-01');

    const result = isDateInRange(new Date('2025-07-10'), startDate, endDate);
    const expected = false;
    expect(result).toBe(expected);
  });
});

describe('fillZero', () => {
  it("5를 2자리로 변환하면 '05'를 반환한다", () => {
    const number = 5;
    const formatted = fillZero(number, 2);
    expect(formatted).toBe('05');
  });

  it("10을 2자리로 변환하면 '10'을 반환한다", () => {
    const number = 10;
    const formatted = fillZero(number, 2);
    expect(formatted).toBe('10');
  });

  it("3을 3자리로 변환하면 '003'을 반환한다", () => {
    const number = 3;
    const formatted = fillZero(number, 3);
    expect(formatted).toBe('003');
  });

  it("100을 2자리로 변환하면 '100'을 반환한다", () => {
    const number = 100;
    const formatted = fillZero(number, 2);
    expect(formatted).toBe('100');
  });

  it("0을 2자리로 변환하면 '00'을 반환한다", () => {
    const number = 0;
    const formatted = fillZero(number, 2);
    expect(formatted).toBe('00');
  });

  it("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    const number = 1;
    const formatted = fillZero(number, 5);
    expect(formatted).toBe('00001');
  });

  it("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    const number = 3.14;
    const formatted = fillZero(number, 5);
    expect(formatted).toBe('03.14');
  });

  it('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    const number = 5;
    const formatted = fillZero(number); // size 파라미터 생략
    expect(formatted).toBe('05');
  });

  it('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    const number = 12345;
    const formatted = fillZero(number, 3);
    expect(formatted).toBe('12345');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const date = new Date('2025-08-22');
    const expected = '2025-08-22';
    const formatted = formatDate(date);

    expect(formatted).toBe(expected);
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const date = new Date('2025-07-12');
    const day = 25;

    const expected = '2025-07-25';
    const formatted = formatDate(date, day);

    expect(formatted).toBe(expected);
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = new Date('2025-05-19');
    const expected = '2025-05-19';
    const formatted = formatDate(date);

    expect(formatted).toBe(expected);
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const date = new Date('2025-11-02');
    const expected = '2025-11-02';
    const formatted = formatDate(date);

    expect(formatted).toBe(expected);
  });
});
