export const unicodeToPreetiMap = {
  'क': 's', 'ख': 'v', 'ग': 'u', 'घ': '3', 'ङ': 'ª', 'च': 'r', 'छ': '5', 'ज': 'h', 'झ': 'em', 'ञ': '`',
  'ट': '6', 'ठ': '7', 'ड': '8', 'ढ': '9', 'ण': '0f', 'त': 't', 'थ': 'y', 'द': 'b', 'ध': 'w', 'न': 'g',
  'प': 'k', 'फ': 'km', 'ब': 'a', 'भ': 'e', 'म': 'd', 'य': 'o', 'र': '/', 'ल': 'n', 'व': 'j', 'श': 'z',
  'ष': 'if', 'स': ';', 'ह': 'x',
  'ड्ड': '‹', 'द्ध': '¢', 'द्व': '¢', 'द्द': '2', 'त्त': 'Q', 'क्त': 'Qm', 'क्ष': 'If', 'त्र': 'q', 'ज्ञ': '1',
  'रु': '?', 'श्र': '>', 'ब्र': 'a|', 'हृ': 'X',
  'ध्र': '„', 'ह्र': 'Å', 'न्न': 'Ì', 'च्र': 'Ø', 'द्य': 'ß', 'ट्र': 'å', 'द्र': '›', 'ड्ढ': '°', 'च्य': 'Ø', 'द्म': 'ß',
  'क्': 'S', 'ख्': 'V', 'ग्': 'U', 'घ्': '£', 'च्': 'R', 'छ्': '¥', 'ज्': 'H', 'झ्': '‰', 'ञ्': '~', 'त्': 'T', 'थ्': 'Y', 'ध्': 'W', 'न्': 'G', 'प्': 'K', 'फ्': 'ˆ', 'ब्': 'A', 'भ्': 'E', 'म्': 'D', 'ल्': 'N', 'व्': 'J', 'श्': 'Z', 'ष्': 'I', 'स्': ':', 'ह्': 'C', 'ण्': '0',
  'ट्': '¥', 'ङ्ग': 'Ë', 'ङ्क': 'Í', 'ङ्ख': 'Î', 'ङ्ङ': '•', 'रू': '¿', 'ट्ठ': 'Ý', '±': '±', 'Ö': 'Ö', '÷': '÷', 'Ü': 'Ü', 'Ò': 'Ò', 'Ù': 'Ù', 'Þ': 'Þ', 'Û': 'Û',
  '—': '—', '–': '–', '्र': '«', '\"': 'Æ', '…': 'Ò', '=': 'Ö', '‘': '…', '’': 'Ú',
  'इ': 'O', 'ई': 'O{', 'उ': 'p', 'ऊ': 'pm', 'ऋ': 'C',
  'ए': 'P', 'ऐ': 'P]', 'ओ': 'cf]', 'औ': 'cf}', 'अ': 'c', 'आ': 'cf',
  'ा': 'f', 'ि': 'l', 'ी': 'L', 'ु': '\'', 'ू': '"', 'ृ': '[', 'े': ']', 'ै': '}', 'ो': 'f]', 'ौ': 'f}',
  'ं': '+', 'ः': 'M', 'ँ': 'F', '्': '\\', 'र्': '{',
  '०': ')', '१': '!', '२': '@', '३': '#', '४': '$', '५': '%', '६': '^', '७': '&', '८': '*', '९': '(',
  '.': 'Þ', '।': '.', ',': ',', '?': '<', '!': 'Û', '-': '-', '_': '_', '/': '÷',
  '(': '_', ')': '-',
  '+': '±', '%': 'Ü', '/': '÷', '^': '«', '!': 'Û', ';': 'Ù', '.': 'Þ',
  'ॐ': 'ç', 'ऽ': '\x98', '“': 'æ', '”': 'Æ', 'ङ्घ': '‹', 'ज्ञ्': '¡', 'द्ध': '¢', 'घ्': '£', 'छ्': '¥', 'ट्ट': '§', 'ड्ढ': '°', 'ठ्ठ': '¶', '{': '{', '}': '‘'
};

export const unicodeToPreeti = (text) => {
  let result = '';
  let i = 0;
  while (i < text.length) {
    let clusterLen = 0;
    if (i + 1 < text.length) {
      if (i + 4 < text.length && text[i + 4] === 'ि' && unicodeToPreetiMap[text.substr(i, 4)]) clusterLen = 4;
      else if (i + 3 < text.length && text[i + 3] === 'ि' && unicodeToPreetiMap[text.substr(i, 3)]) clusterLen = 3;
      else if (i + 2 < text.length && text[i + 2] === 'ि' && unicodeToPreetiMap[text.substr(i, 2)]) clusterLen = 2;
      else if (text[i + 1] === 'ि') clusterLen = 1;

      if (clusterLen > 0) {
        const clusterTranslated = unicodeToPreetiMap[text.substr(i, clusterLen)] || text.substr(i, clusterLen);
        result += 'l' + clusterTranslated;
        i += clusterLen + 1;
        continue;
      }
    }

    if (text[i] === 'र' && text[i + 1] === '्' && i + 2 < text.length) {
      let nextI = i + 2;
      let baseChar = unicodeToPreetiMap[text[nextI]] || text[nextI];
      let matra = '';
      if (nextI + 1 < text.length && "ािीुूृेैोौं".includes(text[nextI + 1])) {
        matra = unicodeToPreetiMap[text[nextI + 1]];
        nextI++;
      }
      result += baseChar + matra + '{';
      i = nextI + 1;
      continue;
    }

    let foundCluster = false;
    for (let len = 4; len >= 2; len--) {
      const cluster = text.substr(i, len);
      if (unicodeToPreetiMap[cluster]) {
        result += unicodeToPreetiMap[cluster];
        i += len;
        foundCluster = true;
        break;
      }
    }
    if (foundCluster) continue;

    const char = text[i];
    result += unicodeToPreetiMap[char] || char;
    i++;
  }
  return result;
};
