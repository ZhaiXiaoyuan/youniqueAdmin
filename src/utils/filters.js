/**
 * Created by Administrator on 2016/9/28 0028.
 */

/**
 * vue所需要的filter都放在这里
 * 在js里面可以这样直接调用：Vue.filter('getLocalISOString')(new Date())
 * */
import Vue from 'vue'

/*格式化时间*/
Vue.filter('formatDate',function(date,fmt){
  if(typeof date !=Date){
    date=new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
});

/*格式化金额*/
Vue.filter('moneyFormat',function(str){
    return (str/100).toFixed(2);
});
/*格式化年龄*/
Vue.filter('age',function(str){
    var str=((new Date()).getTime()-str);
    return Math.floor(str/1000/60/60/(24 * 30 * 12));
});
/*值空时显示字符*/
Vue.filter('empty',function(str){
    return str?str:'-';
});

/*建议状态*/
Vue.filter('newsType',function(str){
    let result='';
    switch (str){
        case 'associationNews':
            result='协会';
            break;
        case 'goddessPalace':
            result='天后宫';
            break;
        case 'mazuWorld':
            result='妈祖世界';
            break;
    }
    return result;
});

/*数据状态*/
Vue.filter('targetStatus',function(str){
    let result='';
    switch (str){
        case 'published':
            result='已发布';
            break;
        case 'removed':
            result='已下架';
            break;
    }
    return result;
});

/*文本显示裁剪*/
Vue.filter('ellipsis',function(txt,length){
    console.log('length:',length);
    var str = txt;
    length=length?length:100;
    if(txt.length>length){
        return str.substr(0,length) + '...' ;
    }
    return txt;
});

