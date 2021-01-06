/**
 * Created by Administrator on 2016/9/27 0027.
 */
/*一般的工具方法*/
import Vue from 'vue'
import router from '../router'
import md5 from 'js-md5'

export default {
    install: function (Vue, options) {
        //常用正则
        window.regex={
          illegal :new RegExp("((?=[\x21-\x7e]+)[^A-Za-z0-9])"),
          illegalAlert:'请勿输入非法字符',
          pNum:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,//正数
          pNumAlert:'请输入大于0的数值，限制2位小数',
          pInt:/^[1-9]*[1-9][0-9]*$/,//正整数
          pIntAlert:'请输入大于0的整数',
          nNum:/^(0|[1-9][0-9]*)$/,//自然数
          nNumAlert:'请输入大于等于0的整数',
          chn:/^[\u4e00-\u9fa5]{0,}$/,
          chnAlert:'请输入纯中文字符串',

          float:/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
          floatAlert:'数值格式有误，请输入小数点前不多于8位、小数点后不多于2位的数值！',

          percent:/^((100(\.00|\.0)?)|((\d|[1-9]\d)(\.\d{1,2})?))$/,
          percentAlert:'百分数格式错误，请输入0~100间数值，可保留两位小数！',

          contact:/^(0\d{2,3}-?\d{7,8})|(1\d{10})$/,
          contactAlert:'请输入正确格式的手机号码或电话号码！',

          phone:/^1\d{10}$/,
          phoneAlert:'请输入正确格式的手机号！',

          mail:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
          mailAlert:'请输入正确格式的邮箱！',

          idCard:/^[a-zA-Z0-9]{1,20}$/,
          idCardAlert:'身份证号码格式错误！',

          shortCode:/^(?![0-9]+$)[0-9A-Za-z]{7,20}$/,
          shortCodeAlert:'域名格式有误，请输入7到20位字母或数字，不可为纯数字！'
        }
        //
      Vue.tools = {
          basicConfig:{
              coverBasicUrl:Vue.appConfig.fileDomain+'',
              imageUrl:Vue.appConfig.domain+'image/',
              resumeUrl:Vue.appConfig.fileDomainUrl+'resume/',
              colors:[
                  '#000000',
                  '#eeece0',
                  '#1c487f',
                  '#4d80bf',
                  '#c24f4a',
                  '#8baa4a',
                  '#7b5ba1',
                  '#46acc8',
                  '#f9963b',
                  '#ffffff',
                  '#f47023'
              ]
          },
        /*生成请求时间戳*/
        genTimestamp:function () {
          return Math.ceil(new Date().getTime()/1000)
        },
        /**
         *
         * @param date
         * @param fmt
         * @returns {*}
         */
        formatDate:function(date,fmt){
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
        },
        sessionInfo:function () {
          let timestamp=this.genTimestamp();
        /*  let userId='07d2cbfa55cf4e6582d67e164405b36b';//临时测试，上线时要检查该字段值*/
          return{
              timeStamp:timestamp,
            /*  userId:userId,*/
          }
        },
        /*获取事件当前元素*/
        getCurEle:function (e) {
          var targetEle=null;
          if(e.currentTarget){
            targetEle=e.currentTarget;
          }else if(event.srcElement){
            targetEle=e.srcElement;
          }
          return targetEle;
        },
        /*阻止事件冒泡*/
        stopPropagation:function(e){
          if(e){
            if(e.cancelBubble){
              e.cancelBubble = true;
            }
            else if(e.stopPropagation){
              e.stopPropagation();
            }
          }
        },
        downloadFile (url){
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";  // 防止影响页面
          iframe.style.height = 0;  // 防止影响页面
          iframe.src = url; 
          document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
          // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
          setTimeout(()=>{
            // iframe.remove();
          }, 5 * 60 * 1000);
        },
        throttle:function (fn, delay, atleast) {
              var timer = null;
              var previous = null;
              return function() {
                  var now = +new Date();

                  if (!previous) previous = now;
                  if (atleast && now - previous > atleast) {
                      fn();
                      // 重置上一次开始时间为本次结束时间
                      previous = now;
                      clearTimeout(timer);
                  } else {
                      clearTimeout(timer);
                      timer = setTimeout(function() {
                          fn();
                          previous = null;
                      }, delay);
                  }
              }
          },
        getAccountInfo () {
            let account=Vue.cookie.get('account');
            if(account){
                return JSON.parse(account);
            }else{
                router.push({name:'login'});
                return{};
            }
        },
        // 在线生成简历
        getUserResumePdf(id,fn){
          Vue.api.getUserResumePdf(({userId:id})).then(resp => {
            if (resp.respCode == "2000") {
              fn(resp.respMsg);
            }else{
              return null;
            }
          });
        },
        // 获取国籍
        getNationality(){
          let list=[  
            {label:"AO",name:"Angola"},   
            {label:"AF",name:"Afghanistan"},   
            {label:"AL",name:"Albania"},   
            {label:"DZ",name:"Algeria"},   
            {label:"AD",name:"Andorra"},   
            {label:"AI",name:"Anguilla"},   
            {label:"AG",name:"Barbuda Antigua"},   
            {label:"AR",name:"Argentina"},   
            {label:"AM",name:"Armenia"},   
            {label:"AU",name:"Australia"},   
            {label:"AT",name:"Austria"},   
            {label:"AZ",name:"Azerbaijan"},   
            {label:"BS",name:"Bahamas"},   
            {label:"BH",name:"Bahrain"},   
            {label:"BD",name:"Bangladesh"},   
            {label:"BB",name:"Barbados"},   
            {label:"BY",name:"Belarus"},   
            {label:"BE",name:"Belgium"},   
            {label:"BZ",name:"Belize"},   
            {label:"BJ",name:"Benin"},   
            {label:"BM",name:"Bermuda Is."},   
            {label:"BO",name:"Bolivia"},   
            {label:"BW",name:"Botswana"},   
            {label:"BR",name:"Brazil"},   
            {label:"BN",name:"Brunei"},   
            {label:"BG",name:"Bulgaria"},   
            {label:"BF",name:"Burkina-faso"},   
            {label:"MM",name:"Burma"},   
            {label:"BI",name:"Burundi"},   
            {label:"CM",name:"Cameroon"},   
            {label:"CA",name:"Canada"},   
            {label:"CF",name:"Central African Republic"},   
            {label:"TD",name:"Chad"},   
            {label:"CL",name:"Chile"},   
            {label:"CN",name:"China"},   
            {label:"CO",name:"Colombia"},   
            {label:"CG",name:"Congo"},   
            {label:"CK",name:"Cook Is."},   
            {label:"CR",name:"Costa Rica"},   
            {label:"CU",name:"Cuba"},   
            {label:"CY",name:"Cyprus"},   
            {label:"CZ",name:"Czech Republic"},   
            {label:"DK",name:"Denmark"},   
            {label:"DJ",name:"Djibouti"},   
            {label:"DO",name:"Dominica Rep."},   
            {label:"EC",name:"Ecuador"},   
            {label:"EG",name:"Egypt"},   
            {label:"SV",name:"EI Salvador"},   
            {label:"EE",name:"Estonia"},   
            {label:"ET",name:"Ethiopia"},   
            {label:"FJ",name:"Fiji"},   
            {label:"FI",name:"Finland"},   
            {label:"FR",name:"France"},   
            {label:"GF",name:"French Guiana"},   
            {label:"GA",name:"Gabon"},   
            {label:"GM",name:"Gambia"},   
            {label:"GE",name:"Georgia"},   
            {label:"DE",name:"Germany"},   
            {label:"GH",name:"Ghana"},   
            {label:"GI",name:"Gibraltar"},   
            {label:"GR",name:"Greece"},   
            {label:"GD",name:"Grenada"},   
            {label:"GU",name:"Guam"},   
            {label:"GT",name:"Guatemala"},   
            {label:"GN",name:"Guinea"},   
            {label:"GY",name:"Guyana"},   
            {label:"HT",name:"Haiti"},   
            {label:"HN",name:"Honduras"},   
            {label:"HK",name:"Hongkong China"},   
            {label:"HU",name:"Hungary"},   
            {label:"IS",name:"Iceland"},   
            {label:"IN",name:"India"},   
            {label:"ID",name:"Indonesia"},   
            {label:"IR",name:"Iran"},   
            {label:"IQ",name:"Iraq"},   
            {label:"IE",name:"Ireland"},   
            {label:"IL",name:"Israel"},   
            {label:"IT",name:"Italy"},   
            {label:"JM",name:"Jamaica"},   
            {label:"JP",name:"Japan"},   
            {label:"JO",name:"Jordan"},   
            {label:"KH",name:"Kampuchea (Cambodia )"},   
            {label:"KZ",name:"Kazakstan"},   
            {label:"KE",name:"Kenya"},   
            {label:"KR",name:"Korea"},   
            {label:"KW",name:"Kuwait"},   
            {label:"KG",name:"Kyrgyzstan"},   
            {label:"LA",name:"Laos"},   
            {label:"LV",name:"Latvia"},   
            {label:"LB",name:"Lebanon"},   
            {label:"LS",name:"Lesotho"},   
            {label:"LR",name:"Liberia"},   
            {label:"LY",name:"Libya"},   
            {label:"LI",name:"Liechtenstein"},   
            {label:"LT",name:"Lithuania"},   
            {label:"LU",name:"Luxembourg"},   
            {label:"MO",name:"Macao China"},   
            {label:"MG",name:"Madagascar"},   
            {label:"MW",name:"Malawi"},   
            {label:"MY",name:"Malaysia"},   
            {label:"MV",name:"Maldives"},   
            {label:"ML",name:"Mali"},   
            {label:"MT",name:"Malta"},   
            {label:"MU",name:"Mauritius"},   
            {label:"MX",name:"Mexico"},   
            {label:"MD",name:"Moldova"},   
            {label:"MC",name:"Monaco"},   
            {label:"MN",name:"Mongolia"},   
            {label:"MS",name:"Montserrat Is."},   
            {label:"MA",name:"Morocco"},   
            {label:"MZ",name:"Mozambique"},   
            {label:"NA",name:"Namibia"},   
            {label:"NR",name:"Nauru"},   
            {label:"NP",name:"Nepal"},   
            {label:"NL",name:"Netherlands"},   
            {label:"NZ",name:"New Zealand"},   
            {label:"NI",name:"Nicaragua"},   
            {label:"NE",name:"Niger"},   
            {label:"NG",name:"Nigeria"},   
            {label:"KP",name:"North Korea"},   
            {label:"NO",name:"Norway"},   
            {label:"OM",name:"Oman"},   
            {label:"PK",name:"Pakistan"},   
            {label:"PA",name:"Panama"},   
            {label:"PG",name:"Papua New Cuinea"},   
            {label:"PY",name:"Paraguay"},   
            {label:"PE",name:"Peru"},   
            {label:"PH",name:"Philippines"},   
            {label:"PL",name:"Poland"},   
            {label:"PF",name:"French Polynesia"},   
            {label:"PT",name:"Portugal"},   
            {label:"PR",name:"Puerto Rico"},   
            {label:"QA",name:"Qatar"},   
            {label:"RO",name:"Romania"},   
            {label:"RU",name:"Russia"},   
            {label:"LC",name:"Saint Lueia"},   
            {label:"VC",name:"Saint Vincent"},   
            {label:"SM",name:"San Marino"},   
            {label:"ST",name:"Sao Tome and Principe"},   
            {label:"SA",name:"Saudi Arabia"},   
            {label:"SN",name:"Senegal"},   
            {label:"SC",name:"Seychelles"},   
            {label:"SL",name:"Sierra Leone"},   
            {label:"SG",name:"Singapore"},   
            {label:"SK",name:"Slovakia"},   
            {label:"SI",name:"Slovenia"},   
            {label:"SB",name:"Solomon Is."},   
            {label:"SO",name:"Somali"},   
            {label:"ZA",name:"South Africa"},   
            {label:"ES",name:"Spain"},   
            {label:"LK",name:"Sri Lanka"},   
            {label:"SD",name:"Sudan"},   
            {label:"SR",name:"Suriname"},   
            {label:"SZ",name:"Swaziland"},   
            {label:"SE",name:"Sweden"},   
            {label:"CH",name:"Switzerland"},   
            {label:"SY",name:"Syria"},   
            {label:"TW",name:"Taiwan China"},   
            {label:"TJ",name:"Tajikstan"},   
            {label:"TZ",name:"Tanzania"},   
            {label:"TH",name:"Thailand"},   
            {label:"TG",name:"Togo"},   
            {label:"TO",name:"Tonga"},   
            {label:"TT",name:"Trinidad and Tobago"},   
            {label:"TN",name:"Tunisia"},   
            {label:"TR",name:"Turkey"},   
            {label:"TM",name:"Turkmenistan"},   
            {label:"UG",name:"Uganda"},   
            {label:"UA",name:"Ukraine"},   
            {label:"AE",name:"United Arab Emirates"},   
            {label:"GB",name:"United Kiongdom"},   
            {label:"US",name:"United States of America"},   
            {label:"UY",name:"Uruguay"},   
            {label:"UZ",name:"Uzbekistan"},   
            {label:"VE",name:"Venezuela"},   
            {label:"VN",name:"Vietnam"},   
            {label:"YE",name:"Yemen"},   
            {label:"YU",name:"Yugoslavia"},   
            {label:"ZW",name:"Zimbabwe"},   
            {label:"ZR",name:"Zaire"},   
            {label:"ZM",name:"Zambia"}
          ]
          return list;
        },
        moneyFormat:function (str) {
            return (str/100).toFixed(2);
        },
        toFormData:function (jsObj) {
            let fd = new FormData();
            for (let o in jsObj) {
                fd.append(o, jsObj[o])
            }
            return fd;
        },
        fileToBlob:function (file,callback) {
              if (!file) {
                  return false
              }
              var reader = new FileReader()
              reader.onload = (e) => {
                  let data
                  if (typeof e.target.result === 'object') {
                      // 把Array Buffer转化为blob 如果是base64不需要
                      data = window.URL.createObjectURL(new Blob([e.target.result]))
                  } else {
                      data = e.target.result
                  }
                  //
                  callback&&callback(data);
              }
              // 转化为base64
              // reader.readAsDataURL(file)
              // 转化为blob
              reader.readAsArrayBuffer(file);
          }
      }

      Object.assign(Vue, Vue.tools);
      Object.assign(Vue.prototype, Vue.tools);
    },
}
