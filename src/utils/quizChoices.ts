export type QuizChoiceIdentity = { id: string };

export type QuizQuestionIdentity = {
  id: string;
  choices: readonly QuizChoiceIdentity[];
  correctChoiceId: string;
};

export type QuizChoiceOrder = Record<string, string[]>;

function shuffleIds(ids: string[]) {
  const shuffled = [...ids];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function createQuizChoiceOrder(questions: readonly QuizQuestionIdentity[]): QuizChoiceOrder {
  const questionIds = new Set<string>();
  const orders = Object.fromEntries(questions.map((question) => {
    const choiceIds = question.choices.map((choice) => choice.id);

    if (questionIds.has(question.id)) {
      throw new Error(`Duplicate quiz question id: ${question.id}`);
    }
    questionIds.add(question.id);

    if (
      choiceIds.length !== 4 ||
      new Set(choiceIds).size !== 4 ||
      choiceIds.filter((choiceId) => choiceId === question.correctChoiceId).length !== 1
    ) {
      throw new Error(`Quiz question "${question.id}" must have four unique choices and exactly one correct choice.`);
    }

    return [question.id, shuffleIds(choiceIds)];
  })) as QuizChoiceOrder;

  // Avoid an accidental run in which every answer occupies the same position.
  if (questions.length > 1) {
    const correctPositions = questions.map((question) => (
      orders[question.id].indexOf(question.correctChoiceId)
    ));

    if (new Set(correctPositions).size === 1) {
      const questionIndex = Math.floor(Math.random() * questions.length);
      const question = questions[questionIndex];
      const order = orders[question.id];
      const correctIndex = order.indexOf(question.correctChoiceId);
      const offset = 1 + Math.floor(Math.random() * (order.length - 1));
      const swapIndex = (correctIndex + offset) % order.length;
      [order[correctIndex], order[swapIndex]] = [order[swapIndex], order[correctIndex]];
    }
  }

  return orders;
}

export function getOrderedQuizChoices<TChoice extends QuizChoiceIdentity>(
  choices: readonly TChoice[],
  order: readonly string[] | undefined,
): TChoice[] {
  if (!order) return [...choices];

  const choicesById = new Map(choices.map((choice) => [choice.id, choice]));
  const orderedChoices = order
    .map((choiceId) => choicesById.get(choiceId))
    .filter((choice): choice is TChoice => choice !== undefined);

  // A locale's labels may change, but the stable option IDs and count must match.
  return orderedChoices.length === choices.length
    ? orderedChoices
    : [...choices];
}
