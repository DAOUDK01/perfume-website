export interface ContentItem {
  _id: string;
  label: string;
  page: string;
  section: string;
  type: "image" | "text";
  value: string;
}

export const getContent = (
  content: ContentItem[],
  section: string,
  label: string,
  type: "image" | "text",
  defaultValue: string
) => {
  const item = content.find(
    (c) => c.section === section && c.label === label && c.type === type
  );
  return item ? item.value : defaultValue;
};
