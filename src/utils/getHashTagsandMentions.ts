export function getHashTagsandMentions(text: string): {
  hashTags: string[];
  mentions: string[];
} {
  const hashTags: string[] = (text.match(/#([a-z0-9]+)/gi) ?? []).map(
    (hashTag) => hashTag.slice(1)
  );
  const mentions: string[] = (text.match(/@[a-z0-9]+/gi) ?? []).map((mention) =>
    mention.slice(1)
  );
  return { hashTags, mentions };
}
