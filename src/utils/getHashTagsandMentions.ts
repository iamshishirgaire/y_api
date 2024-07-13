export function getHashTagsandMentions(text: string): {
  hashTags: string[];
  mentions: string[];
} {
  const hashTags: string[] = (text.match(/#([a-z0-9]+)/gi) ?? []).map(
    (hashTag) => hashTag.slice(1),
  );
  const mentionRegex = /(?:^|\s)@([^\s]+)/gi;
  const mentions: string[] = [];
  let match: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return { hashTags, mentions };
}
