import { APIService, handleApiError, makeQueryParamsFromObject } from '@cheryx2020/api-service';
import publicIp from 'public-ip';

const POST_ITEM_TYPE = {
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
};
/**
 * Get post description from content. Currently, it get the first paragraph of content
 */
const getDescriptionFromContent = (content) => {
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
};

/**
 * Check file size is bigger than size
 * @param {*} file file object
 * @param {*} size default is 500000 (value: 500000 for 500KB)
 */
const isBigFile = (file, size = 500000) => {
  let result = false;
  if (file && file.size > size) {
    result = true;
  }
  return result;
};

const getDomain = () => {
  const pageUrl = process.env.NEXT_PUBLIC_pageUrl;
  let result = "";
  let schema = "https://";
  if (pageUrl) {
    if (pageUrl.includes(schema)) {
      result = pageUrl.split(schema)[1].trim();
    } else {
      result = pageUrl.split("http://")[1].trim();
    }
  }
  return result;
};

const removeAccents = str => {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};

const isMobileDevice = () => {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
const readFile = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};
/**
 * 
 * @param {*} file 
 * @param {*} localPath if exist, the file will be saved to local path
 */
const uploadFile = (file, localPath, hideAlert, fileName, requestAbsoluteUrlResponse) => {
  const bodyFormData = new FormData();
  bodyFormData.set('file', file);
  if (localPath) {
    bodyFormData.set('path', localPath);
  }
  if (fileName) {
    bodyFormData.set('fileName', fileName);
  }
  if (requestAbsoluteUrlResponse) {
    bodyFormData.set('requestAbsoluteUrlResponse', requestAbsoluteUrlResponse);
  }
  return new Promise((resolve, reject) => {
    APIService.post('upload-file', bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      console.log(res);
      // Handle upload file success
      if (res && res.data) {
        if (localPath) {
          resolve(`${res.data}`);
        } else {
          resolve(`https://drive.google.com/uc?export=view&id=${res.data.id}`);
        }
        if (!hideAlert) {
          alert('Tải hình thành công');
        }
      } else {
        reject('Tải ảnh không thành công');
      }
    }).catch(err => {
      handleApiError(err);
    });
  });
};
const deleteFile = (filePath) => {
  return new Promise(resolve => {
    APIService.post('delete-file', { filePath }).then(res => {
      console.log(res);
      resolve(res.data);
    }).catch(err => {
      handleApiError(err);
    });
  });
};

const SLACK_CHANNELS = {
  FREE_CRAFTPATTERNS: 'FREE_CRAFTPATTERNS'
};
const sendSlackMessage = async ({ channel = 'FREE_CRAFTPATTERNS', message = 'Text message' }) => {
  let ip = '', _message = message || '';
  try {
    ip = await publicIp.v4();
  } catch (e) {
    console.log(e);
  }  _message += `\\nIP Address: *${ip}*&ip=${ip}`;
  return APIService.get(`send-message-slack?channel=${channel}&message=${_message}`).then(() => {
    console.log('send-message-slack success');
  }).catch(err => {
    console.log('send-message-slack error');
  })
};

const verifyToken = () => {
  return new Promise((resolve, reject) => {
    APIService.get('user').then(res => {
      resolve({ verified: true, userInfo: res.data });
    }).catch(e => {
      resolve({ verified: false });
    });
  });
};

const transformImageSrc = imgUrl => {
  let result = imgUrl;
  try {
    result = imgUrl.includes('//') && !imgUrl.includes('https://') ? `https:` + imgUrl : imgUrl;
  } catch (e) {
    console.log(e);
  }
  return result;
};

const getListTips = (params = {}) => {
  return new Promise(async (resolve, reject) => {
    await APIService.get(`list-post${makeQueryParamsFromObject(params)}`).then(res => {
      if (res && res.data && res.data.data && res.data.data) {
        resolve(res.data.data.filter(item => item.id != 'tu-hoc-dan-co-ban').map(item => { return { ...item, imgUrl: item.imgUrl || '/images/tips.png' } }));
      }
    }).catch(err => {
      reject(err);
    });
  });
};

const getPageConfig = (params = {}) => {
  const _params = {...params};
  if (!_params.domain) {
    _params.domain = getDomain();
  }
  return new Promise(async (resolve, reject) => {
    await APIService.get(`page${makeQueryParamsFromObject(_params)}`).then(res => {
      if (res && res.data && res.data.content) {
        resolve(res.data.content);
      } else {
        resolve("[]");
      }
    }).catch(err => {
      reject(err);
    });
  });
};

export { POST_ITEM_TYPE, SLACK_CHANNELS, deleteFile, getDescriptionFromContent, getDomain, getListTips, getPageConfig, isBigFile, isMobileDevice, readFile, removeAccents, sendSlackMessage, transformImageSrc, uploadFile, verifyToken };
