const characterReplacements: Record<string, string> = {
  l: 'i',
  à: 'a',
  á: 'a',
  â: 'a',
  ã: 'a',
  ä: 'a',
  å: 'a',
  æ: 'a',
  ç: 'c',
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  ñ: 'n',
  ò: 'o',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ö: 'o',
  ø: 'o',
  ù: 'u',
  ú: 'u',
  û: 'u',
  ü: 'u',
  ý: 'y',
  ß: 'b',
  ÿ: 'y',
};

export function makeToken(value: string): string {
  let result = '';
  let lastCharacter = '';

  for (const character of [...value.toLowerCase()]) {
    const replacedCharacter = characterReplacements[character] ?? character;
    const code = replacedCharacter.charCodeAt(0);

    if (!((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a))) {
      continue;
    }

    if (replacedCharacter === lastCharacter) {
      continue;
    }
    lastCharacter = replacedCharacter;
    result += replacedCharacter;
  }

  return result;
}
