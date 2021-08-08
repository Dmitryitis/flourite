import { C } from './languages/c';
import { CPP } from './languages/cpp';
import { CSS } from './languages/css';
import { Go } from './languages/go';
import { HTML } from './languages/html';
import { Java } from './languages/java';
import { Javascript } from './languages/javascript';
import { PHP } from './languages/php';
import { Python } from './languages/python';
import { Ruby } from './languages/ruby';

export interface LanguagePattern {
	pattern: RegExp;
  points: number;
  nearTop?: boolean;
}
/**
 * A checker is an object with the following form:
 *  { pattern: /something/, points: 1 }
 * or if the pattern only matches code near the top of a given file:
 *  { pattern: /something/, points: 2, nearTop: true }
 *
 * Key: Language name.
 * Value: Array of checkers.
 *
 * N.B. An array of checkers shouldn't contain more regexes than
 * necessary as it would inhibit performance.
 *
 * Points scale:
 *  2 = Bonus points:   Almost unique to a given language.
 *  1 = Regular point:  Not unique to a given language.
 * -1 = Penalty point:  Does not match a given language.
 * Rare:
 * -50 = Bonus penalty points: Only used when two languages are mixed together,
 *  and one has a higher precedence over the other one.
 */
const languages: Record<string, LanguagePattern[]> = {
  C,
  'C++': CPP,
  CSS,
  Go,
  HTML,
  Java,
  Javascript,
  PHP,
  Python,
  Ruby,
  Unknown: [],
};

function getPoints(lineOfCode: string, checkers: LanguagePattern[]) {
	const checker: number[] = checkers.map(o => {
		if (o.pattern.test(lineOfCode)) return o.points;
		return 0;
	})
	const reduced = checker.reduce((memo, num) => memo + num, 0)
	return reduced;
}

export interface Options {
	heuristic: boolean,
	statistics: false
}


function detectLang(snippet: string, options: Options = { heuristic: true, statistics: false }) {
  let linesOfCode = snippet
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .split('\n');

	function nearTop(index: number) {
    if (linesOfCode.length <= 10) {
      return true;
    }
    return index < linesOfCode.length / 10;
  }

	if (options.heuristic && linesOfCode.length > 500) {
		linesOfCode = linesOfCode.filter((_, index) => {
      if (nearTop(index)) {
        return true;
      }
      return index % Math.ceil(linesOfCode.length / 500) === 0;
    });
  }

	const pairs = Object.keys(languages).map((key) => {
    return { language: key, checkers: languages[key] };
  });

	const results = pairs.map((pair) => {
		const language = pair.language;
		const checkers = pair.checkers;

    if (language === 'Unknown') {
      return { language: 'Unknown', points: 1 };
    }

		const pointsList = linesOfCode.map(function (lineOfCode, index) {
      if (!nearTop(index)) {
				return getPoints(
          lineOfCode,
					checkers.filter((checker) => {
						return !checker.nearTop;
          }),
        );
      } else {
				return getPoints(lineOfCode, checkers);
      }
    });

		const points = pointsList.reduce((memo, num) => memo + num);

		return { language, points };
  });

	const bestResult = results.reduce((a, b) => a.points >= b.points ? a : b, { points: 0, language: '' })
	if (options.statistics) {
		const statistics = [];
		for (const result in results) {
      statistics.push([results[result].language, results[result].points]);
    }

		statistics.sort((a, b) => Number(b[1]) - Number(a[1]));
    return { detected: bestResult.language, statistics: statistics };
  }

  return bestResult.language;
}

export default detectLang;