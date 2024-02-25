export const POST_ITEM_TYPE = {
  TITLE: 'title',
  BIG_HEADER: 'big-header',
  MEDIUM_HEADER: 'medium-header',
  SMALL_HEADER: 'small-header',
  PARAGRAPH: 'paragraph',
  RELATED_TOPIC: 'related-topic',
  SUBCRIBE_ME: 'subcribe-me',
  IMAGE: 'image',
  BUY_ME_A_COFFEE: 'buy-me-a-coffee',
  VIDEO: 'video',
  ADS: 'ads',
  PATTERN: 'pattern',
  PATTERN_PREVIEW: 'pattern_preview',
  GROUP: 'group'
}
/**
 * Get post description from content. Currently, it get the first paragraph of content
 */
export const getDescriptionFromContent = (content) => {
  let result = '', data = [];
  if (typeof content === 'string') {
    data = JSON.parse(content);
  }
  if (Array.isArray(content)) {
    data = content;
  }
  if (data.length > 0) {
    const firstParagraphItem = Array.isArray(data) ? data.find(item => item.type === "paragraph") : '';
    if (typeof firstParagraphItem === 'object') {
      result = firstParagraphItem.text;
    }
  }
  return result;
}

/**
 * Check file size is bigger than size
 * @param {*} file file object
 * @param {*} size default is 500000 (value: 500000 for 500KB)
 */
export const isBigFile = (file, size = 500000) => {
  let result = false;
  if (file && file.size > size) {
    result = true;
  }
  return result;
}