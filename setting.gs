function setting() {
  //sheet
  const sheet=ss.getSheets()[1];
  //元のURL
  const url = "https://hitosara.com/"
  const response = UrlFetchApp.fetch(url);
  const content = response.getContentText("utf-8");
  var div1=content.match(/<div class="main_search">.*?<\/div>/s);
  var box=[];
  var dd=div1[0].match(/<dd>.*?<\/dd>/gs);
  dd.forEach(function(d){
    p1=d.match(/<a href=[^<>]*.*?>[^<>]*<\/a>/g)[0];
    p2=p1.match(/(?<=<[^<>]*>\s*)[^<>]*(?=\s*<[^<>]*>)/)[0];
    p3=p1.match(/(?<=\/)(world\/)?[^\/<>]*(?=\/)/g)[0];
    box.push([p2,p3]);
  })
  sheet.getRange(2,1,box.length,box[0].length).setValues(box);
}
