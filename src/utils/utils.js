import uploadConfig from './uploadConfig'
export function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
//生成文件上传的参数
export function getUploadFileParams(file, fileDirName) {
    function get_suffix(filename) {
        var pos = filename.lastIndexOf('.');
        var suffix = '';
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }
    if (!fileDirName) {
        fileDirName = 'map/home/';
    }
    var date = new Date(),
        month = (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate(),
        fileUrl = fileDirName + date.getFullYear() + month + day + '/' + random_string(10) + date.getTime() + get_suffix(file.name),
        dateOver = new Date(date.getTime() + 5 * 60 * 1000),
        policyText = {
            "expiration": dateOver.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
            "conditions": [
                ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
            ]
        },
        policyBase64 = Base64.encode(JSON.stringify(policyText)),
        bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, process.env.ACCESSKEY, {
            asBytes: true
        }),
        signature = Crypto.util.bytesToBase64(bytes);
    return {
        key: fileUrl,
        policy: policyBase64,
        success_action_status: '200',
        OSSAccessKeyId: process.env.ACCESSID,
        signature: signature
    }
}
//金额转换
export function unitConvert(num) {
    var moneyUnits = ["元", "万元", "亿元", "万亿"];
    var dividend = 10000;
    var curentNum = num || 0;
    //转换数字
    var curentUnit = moneyUnits[0];

    function strNumSize(tempNum) {
        var stringNum = tempNum.toString();
        var index = stringNum.indexOf(".");
        var newNum = stringNum;
        if (index != -1) {
            newNum = stringNum.substring(0, index);
        }
        return newNum.length;
    }
    //转换单位
    for (var i = 0; i < 4; i++) {
        curentUnit = moneyUnits[i];
        if (strNumSize(curentNum) < 5) {
            break;
        }
        curentNum = curentNum / dividend;
    }
    var m = {
        num: 0,
        unit: ""
    };
    m.num = curentNum.toFixed(2);
    m.unit = curentUnit;
    return `${m.num}${m.unit}`;
}
//获取当前日期
export function getCurrentDate() {
    let date = new Date()
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

export function setPreviewFileUrl(filetype, url) {
    let fileUrl = '';
    const host = uploadConfig.previewFile[filetype];
    fileUrl = `${host}?WOPISrc=${uploadConfig.fileHost}/wopi/files/${url.replace(
      /\//g,
      '_'
    )}`;
    return fileUrl;
}

