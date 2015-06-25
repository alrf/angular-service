/*global angular, console */
var app = angular.module('app', []);

app.service('psDateTimeInternal', function () {
    "use strict";
    this.getNgParser = function (format) {
        format = format || '';
        var splitFormat = [], formatObj, maskArr = [], methodArr = [], formatArr = [], maxValueArr = [];

        /**
        * Проверка формата.
        * @param {string} format формат
        * @param {object} объект
        */
        function formatValidation(format) {
            if (typeof format !== 'string') { console.log('Invalid format'); return false; }
            splitFormat = format.split(/\/|:|\.|\s+|\[|\]|\(|\)|b/);
            var formatChArr = [], maskChArr = [], maxValue = [], methodChArr = [];
            angular.forEach(splitFormat, function (item) {
                switch (item) {
                case 'yyyy':
                    maskChArr.push('\\d{4}');
                    maxValue.push(9999);
                    methodChArr.push('setFullYear');
                    formatChArr.push(item);
                    break;
                case 'yy':
                    maskChArr.push('\\d{2}');
                    maxValue.push(99);
                    methodChArr.push('setFullYear');
                    formatChArr.push(item);
                    break;
                case 'MM':
                    maskChArr.push('^(0[1-9]|1[012])$');
                    maxValue.push(12);
                    methodChArr.push('setMonth');
                    formatChArr.push(item);
                    break;
                case 'M':
                    maskChArr.push('^([1-9]|1[012])$');
                    maxValue.push(12);
                    methodChArr.push('setMonth');
                    formatChArr.push(item);
                    break;
                case 'dd':
                    maskChArr.push('^(0[1-9]|[12][0-9]|3[01])$');
                    maxValue.push(31);
                    methodChArr.push('setDate');
                    formatChArr.push(item);
                    break;
                case 'd':
                    maskChArr.push('^([1-9]|[12][0-9]|3[01])$');
                    maxValue.push(31);
                    methodChArr.push('setDate');
                    formatChArr.push(item);
                    break;
                case 'HH':
                    maskChArr.push('^(0[0-9]|1[0-9]|2[0-3])$');
                    maxValue.push(23);
                    methodChArr.push('setHours');
                    formatChArr.push(item);
                    break;
                case 'H':
                    maskChArr.push('^([0-9]|1[0-9]|2[0-3])$');
                    maxValue.push(23);
                    methodChArr.push('setHours');
                    formatChArr.push(item);
                    break;
                case 'hh':
                    maskChArr.push('^(0[0-9]|1[0-9]|2[0-3])$');
                    maxValue.push(23);
                    methodChArr.push('setHours');
                    formatChArr.push(item);
                    break;
                case 'h':
                    maskChArr.push('^([0-9]|1[0-9]|2[0-3])$');
                    maxValue.push(23);
                    methodChArr.push('setHours');
                    formatChArr.push(item);
                    break;
                case 'mm':
                    maskChArr.push('^[0-5][0-9]$');
                    maxValue.push(59);
                    methodChArr.push('setMinutes');
                    formatChArr.push(item);
                    break;
                case 'm':
                    maskChArr.push('^([0-9]|[1-5][0-9])$');
                    maxValue.push(59);
                    methodChArr.push('setMinutes');
                    formatChArr.push(item);
                    break;
                case 'ss':
                    maskChArr.push('^[0-5][0-9]$');
                    maxValue.push(59);
                    methodChArr.push('setSeconds');
                    formatChArr.push(item);
                    break;
                case 's':
                    maskChArr.push('^([0-9]|[1-5][0-9])$');
                    maxValue.push(59);
                    methodChArr.push('setSeconds');
                    formatChArr.push(item);
                    break;
                case 'sss':
                    maskChArr.push('\\d{3}');
                    maxValue.push(999);
                    methodChArr.push('setMilliseconds');
                    formatChArr.push(item);
                    break;
                case 'a':
                    maskChArr.push('^[AP]M$');
                    maxValue.push('');
                    methodChArr.push('setA');
                    formatChArr.push(item);
                    break;
                }
            });
            if (maskChArr.length === 0) { console.log('Invalid format'); return false; }
            return { 'mask': maskChArr, 'maxValue': maxValue, 'method': methodChArr, 'format': formatChArr };
        }

        /**
        * Проверка соответствия строки формату.
        * @param {string} str подстрока для проверки
        * @param {regExp} regExpr регулярка, по которой проверяем
        * @param {int} maxValue максимальное значение
        * @returns {boolean} если строка соответствует формату, то true иначе false
        */
        function dateStrValidation(str, regExpr, maxValue) {
            regExpr = new RegExp(regExpr);
            if (str === 'AM' || str === 'PM') { return true; }
            return (regExpr.test(str) && str <= maxValue) ? true : false;
        }

        /**
        * Формируем set-методы.
        * @param {object} obj объект
        * @param {string} method метод
        * @param {string} value значение
        */
        function setMethods(obj, method, value) {
            if (method === 'setMonth') { value = value - 1; }
            if (method === 'setFullYear' && value.length === 2) {
                if (value >= 0 && value <= 68) { value = parseInt(2000, 0) + parseInt(value, 0); }
                if (value >= 69 && value <= 68) { value = parseInt(1900, 0) + parseInt(value, 0); }
            }
            if (method === 'setA') { if (value === 'PM') { obj.setHours(obj.getHours() + 12); } } else { obj[method](value); }
        }

        formatObj = formatValidation(format);
        maskArr = formatObj.mask;
        methodArr = formatObj.method;
        formatArr = formatObj.format;
        maxValueArr = formatObj.maxValue;

        function daysInMonth(iMonth, iYear) { return 32 - new Date(iYear, iMonth, 32).getDate(); }

        return {
            /**
            * Разбор строки.
            * @param {string} dateStr строка с датой
            * @param {Date} baseDate базовая маска для заполнения пропущенных в формате полей даты, могут быть пропущены следующие    поля: 'year','month','date','hours','minutes','seconds'.
            * @returns {Date|null} если строка соответствует формату, то объект Date иначе null
            */
            parse: function (dateStr, baseDate) {
                dateStr = dateStr || '';
                baseDate = (baseDate instanceof Date) ? baseDate : new Date();
                var splitDateStr = dateStr.split(/\/|:|\.|\s+|\[|\]|\(|\)|b|\*/), res = {}, i, len, item, itemIdx, daysItem;
                splitDateStr = splitDateStr.filter(function (n) { return (n > 0 || n === 'AM' || n === 'PM'); });
                splitDateStr = splitDateStr.filter(Boolean); // remove empty array value
                if (splitDateStr.length !== methodArr.length) { console.log('Invalid format 1'); return null; }
                for (i = 0, len = methodArr.length; i < len; i += 1) {
                    item = methodArr[i];
                    itemIdx = methodArr.indexOf(item);
                    if (!dateStrValidation(splitDateStr[itemIdx], maskArr[itemIdx], maxValueArr[itemIdx])) { res = null; break; }
                    setMethods(baseDate, methodArr[itemIdx], splitDateStr[itemIdx]);
                }
                if (methodArr.indexOf('setMonth') !== -1 && methodArr.indexOf('setDate') !== -1 && methodArr.indexOf('setFullYear') !== -1) {
                    daysItem = daysInMonth(parseInt(splitDateStr[methodArr.indexOf('setMonth')], 10) - 1, splitDateStr[methodArr.indexOf('setFullYear')]);
                    if (daysItem < splitDateStr[methodArr.indexOf('setDate')]) { res = null; }
                    setMethods(baseDate, 'setFullYear', splitDateStr[methodArr.indexOf('setFullYear')]);
                    setMethods(baseDate, 'setMonth', splitDateStr[methodArr.indexOf('setMonth')]);
                    setMethods(baseDate, 'setDate', splitDateStr[methodArr.indexOf('setDate')]);
                    baseDate.setHours(baseDate.getHours(), baseDate.getMinutes(), baseDate.getSeconds(), baseDate.getMilliseconds());
                }
                if (methodArr.indexOf('setMilliseconds') === -1) { baseDate.setMilliseconds(0); }
                return res !== null ? new Date(baseDate) : res;
            },
            /**
            * Заполнение незаданных в формате полей даты значениями из базовой даты или значениями из полностью совпадающей даты (используется для границ).
            * @param {Date} value исходная дата
            * @param {Date} baseDate базовая маска для заполнения пропущенных в формате полей даты, могут быть пропущены следующие поля: 'year','month','date','hours','minutes','seconds'.
            * @param {Date} eqDate специальная маска для пограничных значений, применяется при полном совпадении присутствующих в формате полей.
            * @returns {Date | null}
            */
            fillHiddenFields: function (value, baseDate, eqDate) {
                //value = (value instanceof Date) ? value : new Date();
                //baseDate = (baseDate instanceof Date) ? baseDate : new Date();
                //eqDate = (eqDate instanceof Date) ? eqDate : baseDate;
                value = (value instanceof Date) ? new Date(Date.parse(value)) : new Date();
                baseDate = (baseDate instanceof Date) ? new Date(Date.parse(baseDate)) : new Date();
                eqDate = (eqDate instanceof Date) ? new Date(Date.parse(eqDate)) : new Date(Date.parse(baseDate));
                var res = {}, i, len, item, getMethod;
                for (i = 0, len = methodArr.length; i < len; i += 1) {
                    item = methodArr[i];
                    getMethod = item.replace(/set/, 'get');
                    /* что-то не совпало, выходим */
                    if (value[getMethod]() !== eqDate[getMethod]()) { res = null; break; }
                }
                if (res === null) { // 1-ый и 3-ий не совпали по формату, заполняем из 2-ой маски
                    baseDate.setFullYear(methodArr.indexOf('setFullYear') === -1 ? baseDate.getFullYear() : value.getFullYear());
                    baseDate.setMonth(methodArr.indexOf('setMonth') === -1 ? baseDate.getMonth() : value.getMonth());
                    baseDate.setDate(methodArr.indexOf('setDate') === -1 ? baseDate.getDate() : value.getDate());
                    baseDate.setHours(methodArr.indexOf('setHours') === -1 ? baseDate.getHours() : value.getHours());
                    baseDate.setMinutes(methodArr.indexOf('setMinutes') === -1 ? baseDate.getMinutes() : value.getMinutes());
                    baseDate.setSeconds(methodArr.indexOf('setSeconds') === -1 ? baseDate.getSeconds() : value.getSeconds());
                } else { // совпало, заполняем из 3-ей маски
                    eqDate.setFullYear(methodArr.indexOf('setFullYear') === -1 ? eqDate.getFullYear() : value.getFullYear());
                    eqDate.setMonth(methodArr.indexOf('setMonth') === -1 ? eqDate.getMonth() : value.getMonth());
                    eqDate.setDate(methodArr.indexOf('setDate') === -1 ? eqDate.getDate() : value.getDate());
                    eqDate.setHours(methodArr.indexOf('setHours') === -1 ? eqDate.getHours() : value.getHours());
                    eqDate.setMinutes(methodArr.indexOf('setMinutes') === -1 ? eqDate.getMinutes() : value.getMinutes());
                    eqDate.setSeconds(methodArr.indexOf('setSeconds') === -1 ? eqDate.getSeconds() : value.getSeconds());
                }
                return (res === null) ? baseDate : eqDate;
            },
            /**
            * Получение описателя формата (‘yyyy’, ‘mm’, etc.), который визуально соответствует позиции курсора.
            * Например, если формат «HH:mm», dateStr == «12:01», position < 3, то результат «HH».
            * @param {string} dateStr строка с датой
            * @param {number} position позиция курсора в строке
            * @returns {string|null} возвращает описатель формата, если строка соответствует формату
            */
            getTokenInfoByPosition: function (dateStr, position) {
                dateStr = dateStr || '';
                position = position || 0;
                var splitDateStr = dateStr.split(/\/|:|\.|\s+/), res = {}, delimArr, i, len, item, itemIdx;
                splitDateStr = splitDateStr.filter(Boolean);
                if (splitDateStr.length !== methodArr.length) { console.log('Invalid format 1'); return null; }
                /* Проверяем, что строка совпадает с маской */
                for (i = 0, len = methodArr.length; i < len; i += 1) {
                    item = methodArr[i];
                    itemIdx = methodArr.indexOf(item);
                    if (!dateStrValidation(splitDateStr[itemIdx], maskArr[itemIdx], maxValueArr[itemIdx])) { res = null; break; }
                }
                if (res !== null) { // Строка совпала с маской
                    /* Добавляем разделитель, на случай '  10 :15:16:177 10.06.2015', т.е. разделяем явно time и date */
                    dateStr = dateStr.replace(/(\d)\s+(\d)/, "$1:$2");
                    dateStr = dateStr.replace(/(\d)\s+([AM|PM])/, "$1:$2");
                    dateStr = dateStr + ':'; // Небольшой хак, добавляем разделитель в конце строки
                    /* Находим все разделители в строке, собираем в массив */
                    delimArr = [];
                    for (i = 0, len = dateStr.length; i < len; i += 1) {
                        if (/:|\.|\//.test(dateStr[i])) { delimArr.push(i); }
                    }
                    for (i = 0, len = delimArr.length; i < len; i += 1) {
                        if (position <= delimArr[i]) { return formatArr[i]; }
                    }
                }
                return null;
            },
            /**
            * Получение первого описателя формата (‘yyyy’, ‘mm’, etc.)
            * @returns {string}
            */
            getFirstToken: function () {
                formatObj = formatValidation(format);
                return formatObj ? splitFormat[0] : null;
            },
            /**
            * Получение начальной и конечной позиции по описателю формата (‘yyyy’, ‘mm’, etc.), если строка соответствует формату.
            * Например, если формат «HH:mm», dateStr == «12:01», token  == «HH», то результат: {start: 0, end: 2}.
            * @param {string} dateStr строка с датой (только для проверки корректности)
            * @param {string} token описатель формата
            * @returns {Object|null}  Объект с полями start, end или null, если строка не соответствует формату
            */
            getRangeByToken: function (dateStr, token) {
                dateStr = dateStr || '';
                token = token || '';
                var splitDateStr = dateStr.split(/\/|:|\.|\s+/), i, len, item, itemIdx, delimArr, start, end;
                splitDateStr = splitDateStr.filter(Boolean);
                if (splitDateStr.length !== methodArr.length) { console.log('Invalid format 1'); return null; }
                /* Проверяем, что строка совпадает с маской */
                for (i = 0, len = methodArr.length; i < len; i += 1) {
                    item = methodArr[i];
                    itemIdx = methodArr.indexOf(item);
                    if (!dateStrValidation(splitDateStr[itemIdx], maskArr[itemIdx], maxValueArr[itemIdx])) { return null; }
                }
                // Добавляем разделитель, на случай '  10 :15:16:177 10.06.2015', т.е. разделяем явно time и date
                dateStr = dateStr.replace(/(\d)\s+(\d)/, "$1:$2");
                dateStr = dateStr + ':'; // Небольшой хак, добавляем разделитель в конце строки
                // Находим все разделители в строке, собираем в массив
                delimArr = [];
                for (i = 0, len = dateStr.length; i < len; i += 1) {
                    if (/:|\.|\//.test(dateStr[i])) { delimArr.push(i); }
                }
                start = end = 0;
                for (i = 0, len = delimArr.length; i < len; i += 1) {
                    if (formatArr[i] === token) {
                        start = dateStr.indexOf(splitDateStr[i], delimArr[i - 1] || 0);
                        end = start + splitDateStr[i].length;
                        return { 'start': start, 'end': end };
                    }
                }
                return null;
            }
        };
    };
});
