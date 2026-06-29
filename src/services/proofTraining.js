function normalize(value) {
  return String(value ?? '').trim().toLowerCase().replaceAll(' ', '');
}

export function checkProofOrder(actualOrder, expectedOrder) {
  const firstWrongIndex = expectedOrder.findIndex((id, index) => actualOrder[index] !== id);
  return { correct: firstWrongIndex === -1 && actualOrder.length === expectedOrder.length, firstWrongIndex };
}

export function checkProofBlanks(answers, fields) {
  const results = fields.map((field) => ({
    id: field.id,
    correct: normalize(answers[field.id]) === normalize(field.answer)
  }));
  return { correct: results.every((item) => item.correct), results };
}
