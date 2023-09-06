
export function getNonEmptyContent(val: string | null, text: string) {
  return val === '' || !val ? text : val;
}