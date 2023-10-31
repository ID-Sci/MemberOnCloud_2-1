import { Language, changeLanguage } from '../translations/I18n';
export const months_th = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
export const months_th_mini = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export const months_en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const months_en_mini = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export const monthFormat = (month: any) => {
    return Language.getLang() == 'th' ? months_th[Number(month) - 1] : months_en[Number(month) - 1];
}
export const currencyFormat = (num: any) => {
    if (num == 0) return '0.00'
    else return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
export const pointFormat = (num: any) => {
    if (num == 0) return '-'
    else return Number(num).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
export const sumTabledata = (item: any) => {
    var sumItem = 0;
    for (var i in item) {
        sumItem += Number(item[i])
    }
    return sumItem;
}
export const timeFormat = (time: any) => {

    return time.substring(0, 2) + ':' + time.substring(2, 4)
}
export const dateFormat = (date: any) => {
    try {
        var x = new Date()
        var year = x.getFullYear()
        var inputyear = Number(date.substring(0, 4))
        Language.getLang() == 'th' ? inputyear += 543 : inputyear
        return date.substring(6, 8) + ' ' + (Language.getLang() == 'th' ? months_th_mini[Number(date.substring(4, 6)) - 1] : months_en_mini[Number(date.substring(4, 6)) - 1]) + ' ' + inputyear
    
    } catch (error) {
        return date
    }
  }
export const checkDate = (temp_date: any) => {
    if (temp_date.toString().search(':') == -1) {
        var tempdate = temp_date.split('-')
        temp_date = new Date(tempdate[2] + '-' + tempdate[1] + '-' + tempdate[0])
    }
    return temp_date
}
export const setnewdateF = (date: any) => {
    var x = new Date(date);

    var day: any = x.getDate()
    if (day < 10)
        day = '0' + day.toString()

    var month: any = x.getMonth() + 1
    if (month < 10)
        month = '0' + month.toString()

    var year = x.getFullYear()
    return year + '' + month + '' + day
}
export const formatCurrency = (amount: number): string => {
    const roundedAmount = Math.round(amount * 100) / 100; // Round to two decimal places
    const parts = roundedAmount.toFixed(2).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1] ? "." + adjustDecimal(parts[1]) : "";

    return integerPart + decimalPart;
}
function adjustDecimal(decimal: string): string {
    if (decimal.length === 1) {
        return decimal + "0"; // Pad with zero if only one digit after the decimal point
    } else if (decimal.length === 2) {
        return decimal;
    } else {
        const decimalLength = decimal.length;
        const lastDigit = Number(decimal[decimalLength - 1]);

        if (lastDigit >= 5) {
            const roundedDecimal = Math.round(Number(decimal.slice(0, decimalLength - 1)));
            return roundedDecimal.toString();
        } else {
            return decimal.slice(0, decimalLength - 1);
        }
    }
}

export const Radio_menu = (index: any, val: any) => {

    var x: any = new Date();
    var day: any = x.getDate();
    var month: any = x.getMonth() + 1
    var year: any = x.getFullYear()
    var sdate: any = ''
    var edate: any = ''

    if (val == 'lastyear') {
        year = year - 1
        sdate = new Date(year, 0, 1)
        edate = new Date(year, 12, 0)
    } else if (val == 'nowyear') {
        year = year
        sdate = new Date(year, 0, 1)
        edate = new Date(year, 12, 0)
    }
    else if (val == 'nowmonth') {
        month = month - 1
        sdate = new Date(year, month, 1)
        edate = new Date(year, month + 1, 0)
    } else if (val == 'lastmonth') {
        month = month - 2
        sdate = new Date(year, month, 1)
        edate = new Date(year, month + 1, 0)
    }
    else if (val == 'lastday') {
        sdate = new Date().setDate(x.getDate() - 1)
        edate = new Date().setDate(x.getDate() - 1)
    } else {
        sdate = new Date()
        edate = new Date()
    }
    return { index: index, sdate: new Date(sdate), edate: new Date(edate) }
}
export const Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input: any) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode: function (input: any) {
        var output: any = "";
        var chr1: any, chr2: any, chr3: any;
        var enc1: any, enc2: any, enc3: any, enc4: any;
        var i: any = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string: any) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext: any) {
        var string: any = "";
        var i: any = 0;
        var c: any = 0
        var c1: any = 0
        var c2: any = 0;
        var c3: any = 0;
        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}