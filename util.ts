export const findBetween = (string, from, to) => {
  return string.substring(string.lastIndexOf(from) + 1, string.lastIndexOf(to));
};

export const find = (file, type) => {
  const index = file.indexOf(type);
  const previousSemicolon = file.substr(0, index).lastIndexOf(';');

  if (previousSemicolon > -1 && previousSemicolon < index) {
    file = file.substr(previousSemicolon + 1);
  }

  const counters = {
    '(': 0,
    '[': 0,
    '{': 0
  };

  let closeSemicolon = -1;

  file.split('').some((char, index) => {
    if (char === '(') counters['(']++;
    if (char === '[') counters['[']++;
    if (char === '{') counters['{']++;

    if (char === ')') counters['(']--;
    if (char === ']') counters['[']--;
    if (char === '}') counters['{']--;

    if (counters['('] === 0 && counters['['] === 0 && counters['{'] === 0 && char === ';') {
      closeSemicolon = index;
      return true;
    }
  });

  return file.substr(0, closeSemicolon).trim();
};
