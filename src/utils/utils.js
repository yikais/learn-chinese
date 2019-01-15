export function testTrue(value) {
  return /^true$/i.test(value);
}

export function generateResult({
  records,
  showPingYing,
  showMeaning,
  showCharacter,
  showTraditionalCharacter,
  showExample,
  showNotes,
}) {
  return records.map(({
    id,
    pingYing,
    meaning,
    character,
    traditionalCharacter,
    examples,
    notes,
  }) => ({
    id,
    pingYing: testTrue(showPingYing) ? pingYing : '',
    meaning: testTrue(showMeaning) ? meaning : '',
    character: testTrue(showCharacter) ? character : '',
    traditionalCharacter: testTrue(showTraditionalCharacter) ? traditionalCharacter : '',
    examples: testTrue(showExample) ? examples : '',
    notes: testTrue(showNotes) ? notes : '',
  }));
}

export function parseDictionaryResults(data) {
  if (data.length <= 0) return new Error('data is empty');
  /* data from dictionary should appear like:
  [
    [
      [ 'zh' ],
      [ 'ff34a1a191bf420bb932d80eec1e9137' ],
      [ '三' ],
      [ ' three; third; several' ],
      [ 'sān' ],
      [ '/cndic/prons/CN/Entry/99/1012899_F.swf' ],
      [ '0' ] ],
    [ [ 'zh' ],
      [ 'eea205a8fa37483c87110a5c6aabc775' ],
      [ '三伏' ],
      [ ' the hottest days of summer' ],
      [ 'sānfú' ],
      [ '/cndic/prons/CN/Entry/81/1012881_F.swf' ],
      [ '0' ]
    ]
  ] */
  const characterIndex = 2;
  const meaningIndex = 3;
  const pingYingIndex = 4;
  const actualWordIndex = 0;
  const exampleIndexStart = 1;

  const result = {
    pingYing: data[actualWordIndex][pingYingIndex][0],
    meaning: data[actualWordIndex][meaningIndex][0],
    character: data[actualWordIndex][characterIndex][0],
    examples: data.slice(exampleIndexStart).map(datum => ({
      pingYing: datum[pingYingIndex][0],
      meaning: datum[meaningIndex][0],
      phrase: datum[characterIndex][0],
    })),
  };

  return result;
}
