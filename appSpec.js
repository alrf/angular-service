/*global beforeEach, module, describe, inject, it, console, jasmine, expect */
describe('service: psDateTimeInternal', function () {
    "use strict";
    var psDateTimeInternal, parser, request;

    beforeEach(module('app'));

    /*jslint nomen: true*/
    beforeEach(inject(function (_psDateTimeInternal_) {
        psDateTimeInternal = _psDateTimeInternal_;
    }));
    /*jslint nomen: false*/

    it('getNgParser: параметр не передан', function () {
        console.log = jasmine.createSpy("log");
        psDateTimeInternal.getNgParser();
        expect(console.log).toHaveBeenCalledWith('Invalid format');
    });

    it('getNgParser: параметр - пустая строка', function () {
        console.log = jasmine.createSpy("log");
        psDateTimeInternal.getNgParser('');
        expect(console.log).toHaveBeenCalledWith('Invalid format');
    });

    it('getNgParser: параметр - массив', function () {
        console.log = jasmine.createSpy("log");
        psDateTimeInternal.getNgParser([]);
        expect(console.log).toHaveBeenCalledWith('Invalid format');
    });

    it('getNgParser: параметр не валидный', function () {
        console.log = jasmine.createSpy("log");
        psDateTimeInternal.getNgParser('qwerrtyyyy');
        expect(console.log).toHaveBeenCalledWith('Invalid format');
    });

    it('parse: "dd.MM.yyy" - формат даты не совпадает с "07.08.2015"', function () {
        console.log = jasmine.createSpy("log");
        parser = psDateTimeInternal.getNgParser('dd.MM.yyy');
        request = parser.parse('07.08.2015', new Date(new Date().setHours(22, 0, 0)));
        expect(console.log).toHaveBeenCalledWith('Invalid format 1');
    });

    it('parse: "dd.MM.yyyy" - формат даты совпадает с "06.08.2015"', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.parse('06.08.2015', new Date(new Date().setHours(22, 0, 0, 0)));
        var answer = 'Thu Aug 06 2015 22:00:00 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "d.MM.yyyy" - формат даты совпадает с "6.08.2015"', function () {
        parser = psDateTimeInternal.getNgParser('d.MM.yyyy');
        request = parser.parse('6.08.2015', new Date(new Date().setHours(22, 0, 0, 0)));
        var answer = 'Thu Aug 06 2015 22:00:00 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "dd день. MM мес. yyyy год" - "06.08.2015"', function () {
        parser = psDateTimeInternal.getNgParser('dd день. MM мес. yyyy год');
        request = parser.parse('06 день. 08 мес. 2015 год', new Date(new Date().setHours(22, 0, 0, 0)));
        var answer = 'Thu Aug 06 2015 22:00:00 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "[HH]*:(mm):[ss] dd.MM.yy" - "[21]*:(03):[05] 01.03.15"', function () {
        parser = psDateTimeInternal.getNgParser("[HH]*:(mm):[ss] dd.MM.yy");
        request = parser.parse("[21]*:(03):[05] 01.03.15", new Date());
        var answer = 'Sun Mar 01 2015 21:03:05 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "dd.MM.yyyy" - формат даты не совпадает с "6.08.2015"', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.parse('6.08.2015', new Date(new Date().setHours(22, 0, 0, 0)));
        var answer = null;
        expect(request).toEqual(answer);
    });

    it('parse: "HH:mm:ss AM" - формат даты совпадает с "01:14:15"', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss a');
        request = parser.parse('01:14:15 AM', new Date(2015, 5, 11));
        var answer = 'Thu Jun 11 2015 01:14:15 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "H:m:s dd/MM/yyyy a" - "2:8:12 01/03/2014 AM"', function () {
        parser = psDateTimeInternal.getNgParser('H:m:s dd/MM/yyyy a');
        request = parser.parse('2:8:12 01/03/2014 AM', new Date());
        var answer = 'Sat Mar 01 2014 02:08:12 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "HH:mm:ss PM" - формат даты совпадает с "13:14:15"', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss a');
        request = parser.parse('01:14:15 PM', new Date(2015, 5, 11));
        var answer = 'Thu Jun 11 2015 13:14:15 ';
        //expect(request.getTime()).toEqual(answer.getTime());
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "h:m:s d/m/yy a" - "1:4:5 1/2/15 PM", new Date()"', function () {
        parser = psDateTimeInternal.getNgParser('h:m:s d/M/yy a');
        request = parser.parse('1:4:5 1/2/15 PM', new Date());
        var answer = 'Sun Feb 01 2015 13:04:05 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "hh:m:s d/m/yy a" - "01:4:5 1/2/15 PM", new Date()"', function () {
        parser = psDateTimeInternal.getNgParser('hh:m:s d/M/yy a');
        request = parser.parse('01:4:5 1/2/15 PM', new Date());
        var answer = 'Sun Feb 01 2015 13:04:05 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('parse: "dd.MM.yyyy" - "31.02.2015"', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.parse('31.02.2015', new Date());
        var answer = null;
        expect(request).toEqual(answer);
    });

    it('fillHiddenFields(new Date(2015, 11, 31), new Date(new Date().setHours(23,59,59,0)), new Date(2015, 11, 31, 18, 0, 59))', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.fillHiddenFields(new Date(2015, 11, 31), new Date(new Date().setHours(23, 59, 59, 0)), new Date(2015, 11, 31, 18, 0, 59));
        var answer = 'Thu Dec 31 2015 18:00:59 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('fillHiddenFields(new Date(2015, 11, 28), new Date(new Date().setHours(23,59,59,0)), new Date(2015, 11, 31, 18, 0, 59))', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.fillHiddenFields(new Date(2015, 11, 28), new Date(new Date().setHours(23, 59, 59, 0)), new Date(2015, 11, 31, 18, 0, 59));
        var answer = 'Mon Dec 28 2015 23:59:59 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('fillHiddenFields(new Date(2015, 11, 28), new Date(new Date().setHours(23,59,59,0))), expect: Mon Dec 28 2015 23:59:59', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        request = parser.fillHiddenFields(new Date(2015, 11, 28), new Date(new Date().setHours(23, 59, 59, 0)));
        var answer = 'Mon Dec 28 2015 23:59:59 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('fillHiddenFields(new Date("2014-12-11 00:00:00), new Date(2014-07-16 23:59:59), new Date(2014-11-31 18:00:59))', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy HH:ss');
        request = parser.fillHiddenFields(new Date('2014-12-11 00:00:00'), new Date('2014-07-16 23:59:59'), new Date('2014-11-31 18:00:59'));
        var answer = 'Thu Dec 11 2014 00:59:00 ';
        expect(request.toString().split('GMT')[0]).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15:16:177 10.06.2015", 7)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss:sss dd.MM.yyyy');
        request = parser.getTokenInfoByPosition("  10  :15:16:177 10.06.2015", 7);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("10:  15", 3)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('10:  15', 3);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("10:  15", 4)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('10:  15', 4);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("10:  15", 5)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('10:  15', 5);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("10:  15", 6)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('10:  15', 6);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("10:  15", 7)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('10:  15', 7);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 0)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 0);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 1)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 1);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 2)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 2);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 3)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 3);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 4)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 4);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 5)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 5);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15", 6)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getTokenInfoByPosition('  10  :15', 6);
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15:16", 8)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getTokenInfoByPosition('  10  :15:16', 8);
        var answer = 'mm';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15:16", 10)', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getTokenInfoByPosition('  10  :15:16', 10);
        var answer = 'ss';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("13.10.02 2:3:4 AM", 15)', function () {
        parser = psDateTimeInternal.getNgParser('d.M.yy H:m:s a');
        request = parser.getTokenInfoByPosition("12.10.01 1:1:1 AM", 15);
        var answer = 'a';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("  10  :15:16", 10) - передаем некорректный формат, ожидается время/день, получено время', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss dd');
        request = parser.getTokenInfoByPosition('  10  :15:16', 10);
        var answer = null;
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("13.10.02 1:1:1 AM", 16) - "d.M.yy h:m:s a"', function () {
        parser = psDateTimeInternal.getNgParser('d.M.yy h:m:s a');
        request = parser.getTokenInfoByPosition("13.10.02 1:1:1 AM", 16);
        var answer = 'a';
        expect(request).toEqual(answer);
    });

    it('getTokenInfoByPosition("13.10.02 1:1:1 AM", 17) - "d.M.yy h:m:s a"', function () {
        parser = psDateTimeInternal.getNgParser('d.M.yy h:m:s a');
        request = parser.getTokenInfoByPosition("13.10.02 1:1:1 AM", 17);
        var answer = 'a';
        expect(request).toEqual(answer);
    });

    it('getFirstToken: HH:mm:ss', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getFirstToken();
        var answer = 'HH';
        expect(request).toEqual(answer);
    });

    it('getFirstToken: dd/MM/yyyy', function () {
        parser = psDateTimeInternal.getNgParser('dd/MM/yyyy');
        request = parser.getFirstToken();
        var answer = 'dd';
        expect(request).toEqual(answer);
    });

    it('getFirstToken: ss:sss', function () {
        parser = psDateTimeInternal.getNgParser('ss:sss');
        request = parser.getFirstToken();
        var answer = 'ss';
        expect(request).toEqual(answer);
    });

    it('getFirstToken: qazrty', function () {
        parser = psDateTimeInternal.getNgParser('qazrty');
        request = parser.getFirstToken();
        var answer = null;
        expect(request).toEqual(answer);
    });

    it("getRangeByToken('  10:15', 'HH')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getRangeByToken('  10:15', 'HH');
        var answer = { start : 2, end : 4 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken('  10:15:15', 'mm')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getRangeByToken('  10:15:15', 'mm');
        var answer = { start : 5, end : 7 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken('10:15 ', 'mm')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm');
        request = parser.getRangeByToken('10:15 ', 'mm');
        var answer = { start : 3, end : 5 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken(' 10 : 15 :  16', 'ss')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getRangeByToken(' 10 : 15 :  16', 'ss');
        var answer = { start : 12, end : 14 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken(' 10 : 15 :  16', 'mm')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getRangeByToken(' 10 : 15 :  16', 'mm');
        var answer = { start : 6, end : 8 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken(' 10 : 15 :  16 10/06/2015', 'dd')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss dd.MM.yyyy');
        request = parser.getRangeByToken(' 10 : 15 :  16 10/06/2015', 'dd');
        var answer = { start : 15, end : 17 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken(' 10 : 15 :  16 10/06/2015', 'yyyy')", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss dd.MM.yyyy');
        request = parser.getRangeByToken(' 10 : 15 :  16 10/06/2015', 'yyyy');
        var answer = { start : 21, end : 25 };
        expect(request).toEqual(answer);
    });

    it("getRangeByToken(' 10 : 15 :  16 10/06/2015', 'yyyy') - передаем некорректный формат, ожидается время/дата, получено время и день/месяц", function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss dd.MM');
        request = parser.getRangeByToken(' 10 : 15 :  16 10/06/2015', 'yyyy');
        var answer = null;
        expect(request).toEqual(answer);
    });

    it('getRangeByToken("1.2.2002 03:01", "yyyy") expect:"{"start": 4, "end": 8}"', function () {
        parser = psDateTimeInternal.getNgParser('d.M.yyyy HH:mm');
        request = parser.getRangeByToken('1.2.2002 03:01', 'yyyy');
        var answer = { start : 4, end : 8 };
        expect(request).toEqual(answer);
    });

    it('getRangeByToken("10:    15   :05", "mm") expect:"{"start": 7, "end": 12}"', function () {
        parser = psDateTimeInternal.getNgParser('HH:mm:ss');
        request = parser.getRangeByToken("10:    15   :05", "mm");
        var answer = { start : 7, end : 9 };
        expect(request).toEqual(answer);
    });

    it('parse: Количество дней в месяце', function () {
        parser = psDateTimeInternal.getNgParser('dd.MM.yyyy');
        expect(parser.parse('29.02.2015', new Date(new Date().setHours(0, 0, 0, 0)))).toEqual(null);
        expect(parser.parse('29.02.2016', new Date(new Date().setHours(0, 0, 0, 0)))).toEqual(new Date(2016, 1, 29, 0, 0, 0, 0));
    });

});