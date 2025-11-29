export function shouldShowQuestion(rules, answersSoFar) {
  if (!rules) return true;
  const results = (rules.conditions || []).map(cond => {
    const left = answersSoFar ? answersSoFar[cond.questionKey] : undefined;
    const target = cond.value;
    switch (cond.operator) {
      case 'equals': return left === target;
      case 'notEquals': return left !== target;
      case 'contains':
        if (Array.isArray(left)) return left.includes(target);
        if (typeof left === 'string') return String(left).includes(String(target));
        return false;
      default:
        return false;
    }
  });
  return rules.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
}
