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
