export type MathCategory = 'tables' | 'squares' | 'cubes' | 'reciprocals' | 'powers';

export interface Question {
    id: string;
    question: string;
    answer: string | number;
    options?: (string | number)[];
    explanation?: string;
    category: MathCategory;
}

// --- Tables ---
export const getTable = (number: number, limit: number = 20) => {
    return Array.from({ length: limit }, (_, i) => {
        const multiplier = i + 1;
        return {
            multiplicand: number,
            multiplier,
            result: number * multiplier,
        };
    });
};

// --- Squares ---
export const getSquares = (limit: number = 100) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        return { n, result: n * n };
    });
};

// --- Cubes ---
export const getCubes = (limit: number = 20) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        return { n, result: n * n * n };
    });
};

// --- Reciprocals ---
export const getReciprocals = (limit: number = 30) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        const decimal = 1 / n;
        return {
            n,
            fraction: `1/${n}`,
            decimal: parseFloat(decimal.toFixed(5)),
            percentage: parseFloat((decimal * 100).toFixed(2)),
        };
    });
};

// --- Powers ---
export const getPowers = (base: number, limit: number) => {
    return Array.from({ length: limit }, (_, i) => {
        const exponent = i + 1;
        return {
            base,
            exponent,
            result: Math.pow(base, exponent),
        };
    });
};

export const getAllPowers = () => {
    return {
        2: getPowers(2, 25),
        3: getPowers(3, 12),
        5: getPowers(5, 10),
        6: getPowers(6, 8),
        7: getPowers(7, 8),
    };
};

// --- Quiz Generation ---

const generateOptions = (correctAnswer: number | string, count: number, type: 'number' | 'decimal' | 'string') => {
    const options = new Set<number | string>();
    options.add(correctAnswer);

    const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    while (options.size < count) {
        let wrongAnswer: number | string;
        if (type === 'number') {
            const diff = getRandomNumber(-10, 10);
            const val = (correctAnswer as number) + diff;
            if (val > 0 && val !== correctAnswer) {
                wrongAnswer = val;
                options.add(wrongAnswer);
            }
        } else if (type === 'decimal') {
            const diff = getRandomNumber(-5, 5);
            const val = (correctAnswer as number) * (1 + diff / 100);
            wrongAnswer = parseFloat(val.toFixed(4));
            if (wrongAnswer !== correctAnswer) {
                options.add(wrongAnswer);
            }
        } else {
            // Fallback for strings or other types
            wrongAnswer = getRandomNumber(1, 100).toString();
            if (wrongAnswer !== correctAnswer) {
                options.add(wrongAnswer);
            }
        }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
};

export function generateQuizQuestion(category: MathCategory, optionCount: number = 4, config?: any): Question {
    switch (category) {
        case 'tables': {
            const min = config?.min || 2;
            const max = config?.max || 20;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const mult = Math.floor(Math.random() * 10) + 1;
            const answer = num * mult;
            return {
                id: `${num}x${mult}`,
                question: `${num} × ${mult} = ?`,
                answer,
                options: generateOptions(answer, optionCount, 'number'),
                category
            };
        }
        case 'squares': {
            const min = config?.min || 2;
            const max = config?.max || 30;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = num * num;
            return {
                id: `sq${num}`,
                question: `${num}² = ?`,
                answer,
                options: generateOptions(answer, optionCount, 'number'),
                category
            };
        }
        case 'cubes': {
            const min = config?.min || 2;
            const max = config?.max || 15;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = num * num * num;
            return {
                id: `cb${num}`,
                question: `${num}³ = ?`,
                answer,
                options: generateOptions(answer, optionCount, 'number'),
                category
            };
        }
        case 'reciprocals': {
            const min = config?.min || 2;
            const max = config?.max || 20;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = (1 / num).toFixed(4);
            return {
                id: `rc${num}`,
                question: `1/${num} = ?`,
                answer,
                options: generateOptions(parseFloat(answer), optionCount, 'decimal'),
                category
            };
        }
        case 'powers': {
            const bases = [2, 3, 5];
            const base = bases[Math.floor(Math.random() * bases.length)];
            const exp = Math.floor(Math.random() * 5) + 2;
            const answer = Math.pow(base, exp);
            return {
                id: `pw${base}^${exp}`,
                question: `${base}^${exp} = ?`,
                answer,
                options: generateOptions(answer, optionCount, 'number'),
                category
            };
        }
        default:
            return { id: 'err', question: 'Error', answer: 0, category: 'tables' };
    }
}
