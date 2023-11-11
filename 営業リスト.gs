//spreadsheetの指定
const ss = SpreadsheetApp.getActiveSpreadsheet();

function main() {
  var urlnums = hitosara();
  var boxes = [];
  urlnums.forEach(function (urlnum) {
    boxes.push(getinf(urlnum));
    //検索回数を少なくする
    Utilities.sleep(500);
  })
  var sheet0 = ss.getSheets()[0]
  const lastrow = sheet0.getLastRow();
  sheet0.getRange(lastrow + 1, 1, boxes.length, boxes[0].length).setValues(boxes);
}
//情報がないときだけ探索
function searchhp() {
  sheet = ss.getSheets()[0];
  let lastrow = sheet.getLastRow();
  var boxes = sheet.getRange(2, 1, lastrow - 1, 3).getValues();
  var newboxes = [];
  boxes.forEach(function (box) {
    let homepage=box[2]
    if (!box[2]) {
      page = url(box[0]);
      //検索回数を少なくする
      Utilities.sleep(500);
      homepage=page.replace(/.*?tabelog[.\.]*?|.*?instagram[.\.]*?|.*?hitosara[.\.]*?/g, '');
    }
    newboxes.push([homepage]);
  })
  //console.log(newboxes);
  sheet.getRange(2,3,newboxes.length,newboxes[0].length).setValues(newboxes);
}
//ホームページがinstagramのときは無効
function infd(num) {
  sheet = ss.getSheets()[0];
  var boxes = sheet.getRange(2, 1, sheet.getLastRow(), num).getValues();
  var newboxes = [];
  const lastrow = sheet.getLastRow();
  boxes.forEach(function (box) {
    let url = box[num];
    if (url) {
      newboxes.push(findinf(url));
      Utilities.sleep(500);
    } else {
      newboxes.push(['', '', '']);
    }
  })
  sheet.getRange(lastrow + 1, num + 1, newboxes.length, newboxes[0].length).setValues(newboxes);
}
function hitosara() {
  const response = UrlFetchApp.fetch(makeurl());
  const content = response.getContentText("utf-8");
  const ob_shop = content.match(/<ul class="card">.*?(?=<ul class="pager">)/s);
  var urlcom = ob_shop[0].match(/<div class="main-wrapper">.*?<\/div>/sg);
  urlnums = [];
  urlcom.forEach(function (shop) {
    urlnum = shop.match(/(?<=<a href="\/)\d{10}\/(?=" target="_blank" rel="noopener">)/)[0];
    urlnums.push(urlnum);
  })
  return urlnums;
}
function getinf(urlnum) {
  //urlnum='0020005983/';
  //urlnum='0020000711/';
  const url = 'https://hitosara.com/' + urlnum;
  console.log(url);
  const response = UrlFetchApp.fetch(url);
  const content = response.getContentText("utf-8");
  const shopname = content.match(/(?<=<div class="shop-name">.*?<a href[^<>]*>\s*)[^<>]*(?=\s*<\/a>)/s);
  var shopinf = content.match(/<div class="shop_info">.*?<h4>基本情報<\/h4>.*?<div class="sent_bx">/s);
  if (shopinf) {
    var phonenum = shopinf[0].match(/(?<=<p class="phone_num[^<>]*">[^<>]*)[0-9０－９]+[-ー][0-9０－９]+[-ー][0-9０－９]+(?=[^<>]*<\/p>)/g);
    var homepage = shopinf[0].match(/(?<=<th\s*>ホームページ<\/th>\s*<td\s*>\s*<a href[^<>]*>\s*)[^<>]*(?=\s*<\/a>)/);
    if (phonenum) {
      pnum = phonenum.pop();
    } else {
      pnum = phonenum;
    }
    if (homepage) {
      //console.log([shopname[0],pnum,homepage[0]]);
      return [shopname[0], pnum, homepage[0]];
    } else {
      //console.log([shopname[0],pnum,homepage]);
      return [shopname[0], pnum, homepage];
    }
  } else {
    return [shopname[0], shopinf, shopinf];
  }
}
function makeurl() {
  //元のURL
  const url = "https://hitosara.com/";
  //ジャンル
  let genre = "GB11";
  //都道府県
  let p1 = "tokyo";
  //地区
  let p2 = "T001";
  const newurl = url + genre + "/" + p1 + "/" + p2 + "/";
  const encodeWord = encodeURI(newurl);
  console.log(encodeWord);
  return encodeWord;
}
