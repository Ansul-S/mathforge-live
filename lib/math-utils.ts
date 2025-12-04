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
export const generateQuizQuestion = (
    category: MathCategory,
    optionsCount: number = 4,
    config?: any
): Question => {
    let question = '';
    let answer: string | number = '';
    let options: (string | number)[] = [];
    let explanation = '';

    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateOptions = (correct: number, range: number = 10) => {
        const opts = new Set<number>();
        opts.add(correct);
        while (opts.size < optionsCount) {
            const diff = getRandomInt(-range, range);
            const val = correct + diff;
            if (val > 0 && val !== correct) opts.add(val);
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    };

    switch (category) {
        case 'tables': {
            const table = config?.table || getRandomInt(1, 20); // Default range if not specified
            const multiplier = getRandomInt(1, 20);
            question = `${table} × ${multiplier} = ?`;
            answer = table * multiplier;
            options = generateOptions(answer as number, Math.max(10, table));
            break;
        }
        case 'squares': {
            const n = getRandomInt(1, 100);
            question = `${n}² = ?`;
            answer = n * n;
            options = generateOptions(answer as number, n * 5);
            break;
        }
        case 'cubes': {
            const n = getRandomInt(1, 20);
            question = `${n}³ = ?`;
            answer = n * n * n;
            options = generateOptions(answer as number, n * n);
            break;
        }
        case 'reciprocals': {
            const n = getRandomInt(1, 30);
            const type = Math.random() > 0.5 ? 'decimal' : 'percentage';
            const rec = 1 / n;

            if (type === 'decimal') {
                question = `Decimal value of 1/${n}?`;
                answer = parseFloat(rec.toFixed(4));
                // Generate close decimal options
                const opts = new Set<number>();
                opts.add(answer as number);
                while (opts.size < optionsCount) {
                    const wrongN = getRandomInt(Math.max(1, n - 5), n + 5);
                    if (wrongN !== n) opts.add(parseFloat((1 / wrongN).toFixed(4)));
                }
                options = Array.from(opts).sort(() => Math.random() - 0.5);
            } else {
                question = `Percentage value of 1/${n}?`;
                answer = parseFloat((rec * 100).toFixed(2));
                const opts = new Set<number>();
                opts.add(answer as number);
                while (opts.size < optionsCount) {
                    const wrongN = getRandomInt(Math.max(1, n - 5), n + 5);
                    if (wrongN !== n) opts.add(parseFloat(((1 / wrongN) * 100).toFixed(2)));
                }
                options = Array.from(opts).sort(() => Math.random() - 0.5);
            }
            break;
        }
        case 'powers': {
            const bases = [2, 3, 5, 6, 7];
            const base = bases[getRandomInt(0, bases.length - 1)];
            let maxExp = 8;
            if (base === 2) maxExp = 25;
            if (base === 3) maxExp = 12;
            if (base === 5) maxExp = 10;

            const exp = getRandomInt(1, maxExp);

            if (Math.random() > 0.5) {
                question = `${base}^${exp} = ?`;
                answer = Math.pow(base, exp);
                // Generate power options (same base different exp)
                const opts = new Set<number>();
                opts.add(answer as number);
                while (opts.size < optionsCount) {
                    const wrongExp = getRandomInt(Math.max(1, exp - 3), exp + 3);
                    if (wrongExp !== exp) opts.add(Math.pow(base, wrongExp));
                }
                options = Array.from(opts).sort(() => Math.random() - 0.5);
            } else {
                const val = Math.pow(base, exp);
                question = `${val} is which power of ${base}?`;
                answer = exp;
                options = generateOptions(answer as number, 3);
            }
            break;
        }
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        question,
        answer,
        options,
        explanation,
        category
    };
};
