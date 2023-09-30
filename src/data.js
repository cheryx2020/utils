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
      const firstParagraphItem = Array.isArray(data) ? data.find(item => item.type === POST_ITEM_TYPE.PARAGRAPH) : '';
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
    if (file && file.size > 500000) {
      result = true;
    }
    return result;
  }