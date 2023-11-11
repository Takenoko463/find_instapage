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
