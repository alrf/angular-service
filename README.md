
Сервис psDateTimeInternal с методом getNgParser. Код будет добавлен в существующий сервис psDateTimeInternal и будет использовать парсер angularjs.
 
/*  
  Получение парсера дат с заданным форматом.  
  @param {string} format формат даты принятый в AngularJS (поддерживать описатели yyyy, yy, MMMM, MMM, MM, M, dd, d, EEEE, EEE, HH, H, hh, h, mm, m, ss, s, sss, a)  
 @returns {Object} объект позволяющий парсить строку по заданному формату (описание объекта «парсер» ниже)  
*/  
function getNgParser(format)  

Объект «парсер» предоставляет следующие методы:  
/*  
 Разбор строки.  
 @param {string} dateStr строка с датой  
 @param {Date} baseDate базовая маска для заполнения пропущенных в формате полей даты, могут быть пропущены следующие поля:  'year','month','date','hours','minutes','seconds'.  
 @returns {Date|null} если строка соответствует формату, то объект Date иначе null  
*/  
function parse(dateStr, baseDate)  

/*  
Заполнение незаданных в формате полей даты значениями из базовой даты или значениями из полностью совпадающей даты (используется для границ).  
@param {Date} value исходная дата  
@param {Date} baseDate базовая маска для заполнения пропущенных в формате полей даты, могут быть пропущены следующие поля:  'year','month','date','hours','minutes','seconds'.  
@param {Date} eqDate специальная маска для пограничных значений, применяется при полном совпадении присутствующих в формате полей.  
@returns {Date | null}  
*/  
function fillHiddenFields(value, baseDate, eqDate)  

/*  
Получение описателя формата (‘yyyy’, ‘mm’, etc.), который визуально соответствует позиции курсора.  
Например, если формат «HH:mm», dateStr == «12:01», position < 3, то результат «HH».  
@param {string} dateStr строка с датой  
@param {number} position позиция курсора в строке  
@returns {string|null} возвращает описатель формата, если строка соответствует формату  
*/  
function getTokenInfoByPosition(dateStr, position)  

/*  
Получение первого описателя формата (‘yyyy’, ‘mm’, etc.)  
@returns {string}  
*/  
function getFirstToken()  

/*  
Получение начальной и конечной позиции по описателю формата (‘yyyy’, ‘mm’, etc.), если строка соответствует формату.  
Например, если формат «HH:mm», dateStr == «12:01», token  == «HH», то результат: {start: 0, end: 2}.  
@param {string} dateStr строка с датой (только для проверки корректности)  
@param {string} token описатель формата  
@returns {Object|null}  Объект с полями start, end или null, если строка не соответствует формату  
*/  
function getRangeByToken(dateString, token)  
