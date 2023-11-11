//homepageから必要な情報を見つける.
function findinf(url){
  var newurlbox=url.match(/https:\/\/.*?\//);
  if(newurlbox){
    newurl=newurlbox[0];
  }else{
    newurl=url;
    console.log(url);
  }
  const res = UrlFetchApp.fetch(newurl).getContentText('UTF-8');
  var newbox=[];
  //
  //メールをくり抜く
  let mailbox=res.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  //お問合せのリンクの正規表現
  let regex= new RegExp(newurl+'[^<>]*contact\/');
  //お問合せのリンクをくり抜く.
  let concatbox=res.match(regex);
  //instagramのリンクをくり抜く.
  let instabox=res.match(/https:\/\/www.instagram.com\/[^<>]*\//);
  if(mailbox){
    newbox.push(mailbox[0]);
  }else{
    newbox.push('');
  }
  if(concatbox){
    newbox.push(concatbox[0])
  }else{
    newbox.push('');
  }
  if(instabox){
    newbox.push(instabox[0])
  }else{
    newbox.push('');
  }
  console.log(newbox);
  return newbox;
}
//yahoo検索からhomepageを見つける。
function url(str){
  const encodeWord = encodeURI(str);
  const url = 'https://search.yahoo.co.jp/search?p='+encodeWord;
  const res = UrlFetchApp.fetch(url).getContentText('UTF-8');
  const $ = Cheerio.load(res);
  //URL文字列を入れておくための配列
  const arr = [];
  //繰り返し要素を指定して
  $('li a').each((i,elem) => {
    //繰り返し要素の中にあるhrefの値を取得する
    arr[i] = $(elem).attr('href');
  });
  console.log(arr[0]);
  //欲しいのは最初の検索結果のみ
  return arr[0];
}