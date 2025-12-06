export type MathCategory = 'tables' | 'squares' | 'cubes' | 'reciprocals' | 'powers';

export interface QuestionOption {
    id: string;
    label: string;
    value: number | string;
}

export interface Question {
    id: string;
    question: string;
    correctOptionId: string;
    options?: QuestionOption[];
    explanation?: string;
    category: MathCategory | 'mental' | 'mixed';
}

// --- Helper: Check Answer ---
export const checkAnswer = (question: Question, selectedOptionId: string): boolean => {
    return question.correctOptionId === selectedOptionId;
};

// --- Helper: Generate Options ---
const generateOptions = (correctAnswer: number | string, count: number, type: 'number' | 'decimal' | 'string'): QuestionOption[] => {
    const options: QuestionOption[] = [];
    const correctId = `opt-${Math.random().toString(36).substr(2, 9)}`;

    // Add correct option
    options.push({
        id: correctId,
        label: correctAnswer.toString(),
        value: correctAnswer
    });

    const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const usedValues = new Set<string | number>();
    usedValues.add(correctAnswer);

    while (options.length < count) {
        let wrongAnswer: number | string;
        if (type === 'number') {
            const diff = getRandomNumber(-10, 10);
            const val = (correctAnswer as number) + diff;
            if (val > 0 && !usedValues.has(val)) {
                wrongAnswer = val;
                usedValues.add(wrongAnswer);
                options.push({
                    id: `opt-${Math.random().toString(36).substr(2, 9)}`,
                    label: wrongAnswer.toString(),
                    value: wrongAnswer
                });
            }
        } else if (type === 'decimal') {
            const diff = getRandomNumber(-15, 15); // Wider range for decimals
            if (diff === 0) continue;

            const val = (correctAnswer as number) * (1 + diff / 100);
            wrongAnswer = parseFloat(val.toFixed(4));

            if (!usedValues.has(wrongAnswer)) {
                usedValues.add(wrongAnswer);
                options.push({
                    id: `opt-${Math.random().toString(36).substr(2, 9)}`,
                    label: wrongAnswer.toString(),
                    value: wrongAnswer
                });
            }
        } else {
            // Fallback
            wrongAnswer = getRandomNumber(1, 100).toString();
            if (!usedValues.has(wrongAnswer)) {
                usedValues.add(wrongAnswer);
                options.push({
                    id: `opt-${Math.random().toString(36).substr(2, 9)}`,
                    label: wrongAnswer.toString(),
                    value: wrongAnswer
                });
            }
        }
    }

    return options.sort(() => Math.random() - 0.5);
};

// --- Difficulty Logic ---

const getDifficultyParams = (category: MathCategory, level: number) => {
    switch (category) {
        case 'tables':
            if (level === 1) return { min: 2, max: 10, maxMult: 10 };
            if (level === 2) return { min: 2, max: 12, maxMult: 12 };
            if (level === 3) return { min: 5, max: 15, maxMult: 15 };
            if (level === 4) return { min: 10, max: 20, maxMult: 20 };
            return { min: 12, max: 25, maxMult: 25 }; // Level 5

        case 'squares':
            if (level === 1) return { min: 2, max: 10 };
            if (level === 2) return { min: 11, max: 20 };
            if (level === 3) return { min: 21, max: 30 };
            if (level === 4) return { min: 31, max: 50 };
            return { min: 51, max: 99 };

        case 'cubes':
            if (level === 1) return { min: 2, max: 5 };
            if (level === 2) return { min: 6, max: 10 };
            if (level === 3) return { min: 11, max: 15 };
            if (level === 4) return { min: 16, max: 20 };
            return { min: 21, max: 25 };

        case 'reciprocals':
            if (level === 1) return { min: 2, max: 10 }; // Simple: 1/2, 1/4, 1/5, 1/10
            if (level === 2) return { min: 3, max: 12 }; // Repeating: 1/3, 1/6, 1/9, 1/11
            if (level === 3) return { min: 13, max: 20 };
            if (level === 4) return { min: 21, max: 25 };
            return { min: 26, max: 30 };

        case 'powers':
            if (level === 1) return { bases: [2, 10], maxExp: 5 };
            if (level === 2) return { bases: [2, 3, 5], maxExp: 4 };
            if (level === 3) return { bases: [2, 3, 4, 5], maxExp: 5 };
            if (level === 4) return { bases: [6, 7, 8, 9], maxExp: 3 };
            return { bases: [2, 3, 4, 5, 6, 7, 8, 9], maxExp: 6 };

        default:
            return { min: 2, max: 10 };
    }
};

// --- Question Generation ---

// Buffer to prevent repetition
const questionBuffer: string[] = [];
const BUFFER_SIZE = 10;

const addToBuffer = (id: string) => {
    questionBuffer.push(id);
    if (questionBuffer.length > BUFFER_SIZE) {
        questionBuffer.shift();
    }
};

const isInBuffer = (id: string) => questionBuffer.includes(id);

export function generateQuizQuestion(
    category: MathCategory,
    optionCount: number = 4,
    config?: any,
    difficultyLevel: number = 1
): Question {
    let question: Question;
    let attempts = 0;

    do {
        question = createQuestion(category, optionCount, config, difficultyLevel);
        attempts++;
    } while (isInBuffer(question.id) && attempts < 5);

    addToBuffer(question.id);
    return question;
}

function createQuestion(
    category: MathCategory,
    optionCount: number,
    config: any,
    level: number
): Question {
    const params = getDifficultyParams(category, level);

    switch (category) {
        case 'tables': {
            if (config?.table) {
                const num = config.table;
                const mult = Math.floor(Math.random() * (params.maxMult || 10)) + 1;
                const answer = num * mult;

                const options = generateOptions(answer, optionCount, 'number');
                const correctOption = options.find(o => o.value === answer)!;

                return {
                    id: `${num}x${mult}`,
                    question: `${num} × ${mult} = ?`,
                    correctOptionId: correctOption.id,
                    options,
                    category
                };
            }

            const min = config?.min || params.min;
            const max = config?.max || params.max;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const mult = Math.floor(Math.random() * (params.maxMult || 10)) + 1;
            const answer = num * mult;

            const options = generateOptions(answer, optionCount, 'number');
            const correctOption = options.find(o => o.value === answer)!;

            return {
                id: `${num}x${mult}`,
                question: `${num} × ${mult} = ?`,
                correctOptionId: correctOption.id,
                options,
                category
            };
        }
        case 'squares': {
            const min = config?.min || params.min;
            const max = config?.max || params.max;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = num * num;

            const options = generateOptions(answer, optionCount, 'number');
            const correctOption = options.find(o => o.value === answer)!;

            return {
                id: `sq${num}`,
                question: `${num}² = ?`,
                correctOptionId: correctOption.id,
                options,
                category
            };
        }
        case 'cubes': {
            const min = config?.min || params.min;
            const max = config?.max || params.max;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = num * num * num;

            const options = generateOptions(answer, optionCount, 'number');
            const correctOption = options.find(o => o.value === answer)!;

            return {
                id: `cb${num}`,
                question: `${num}³ = ?`,
                correctOptionId: correctOption.id,
                options,
                category
            };
        }
        case 'reciprocals': {
            const min = config?.min || params.min;
            const max = config?.max || params.max;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const answer = parseFloat((1 / num).toFixed(4));

            const options = generateOptions(answer, optionCount, 'decimal');
            const correctOption = options.find(o => o.value === answer)!;

            return {
                id: `rc${num}`,
                question: `1/${num} = ?`,
                correctOptionId: correctOption.id,
                options,
                category
            };
        }
        case 'powers': {
            const bases = params.bases || [2, 3];
            const base = bases[Math.floor(Math.random() * bases.length)];
            const exp = Math.floor(Math.random() * (params.maxExp || 3)) + 2;
            const answer = Math.pow(base, exp);

            const options = generateOptions(answer, optionCount, 'number');
            const correctOption = options.find(o => o.value === answer)!;

            return {
                id: `pw${base}^${exp}`,
                question: `${base}^${exp} = ?`,
                correctOptionId: correctOption.id,
                options,
                category
            };
        }
        default:
            return {
                id: 'err',
                question: 'Error',
                correctOptionId: 'err',
                category: 'tables'
            };
    }
}

// --- Legacy Exports for Compatibility (if needed) ---
export const getSquares = (limit: number = 100) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        return { n, result: n * n };
    });
};

export const getCubes = (limit: number = 20) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        return { n, result: n * n * n };
    });
};

export const getReciprocals = (limit: number = 30) => {
    return Array.from({ length: limit }, (_, i) => {
        const n = i + 1;
        const decimal = 1 / n;
        return {
            n,
            fraction: `1/${n}`,
            decimal: parseFloat(decimal.toFixed(4)),
            percentage: parseFloat((decimal * 100).toFixed(2))
        };
    });
};

export const getTable = (n: number, limit: number = 10) => {
    return Array.from({ length: limit }, (_, i) => {
        const multiplier = i + 1;
        return {
            multiplicand: n,
            multiplier,
            result: n * multiplier
        };
    });
};

export const getAllPowers = () => {
    const bases = [2, 3, 5, 6, 7];
    const powers: Record<number, any[]> = {};

    bases.forEach(base => {
        powers[base] = [];
        const limit = base === 2 ? 12 : base === 3 ? 7 : 5;
        for (let i = 1; i <= limit; i++) {
            powers[base].push({
                base,
                exponent: i,
                result: Math.pow(base, i)
            });
        }
    });

    return powers;
};

