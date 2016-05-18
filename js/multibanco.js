var Multibanco = function() { };

Multibanco.prototype.getPaymentRef = function(_ENTIDADE, _SUBENTIDADE, _ID, _VALOR) {

    var ENT_CALC = (51 * parseInt(String(_ENTIDADE).charAt(0)) +
        73 * parseInt(String(_ENTIDADE).charAt(1)) +
        17 * parseInt(String(_ENTIDADE).charAt(2)) +
        89 * parseInt(String(_ENTIDADE).charAt(3)) +
        38 * parseInt(String(_ENTIDADE).charAt(4)));

    var iCHECKDIGITS = 0;
    var sTMP = "";

    sTMP = String(this.right("000" + _SUBENTIDADE.toString(), 3) + this.right("0000" + _ID.toString(), 4) + this.right("00000000" + (parseFloat(_VALOR) * 100).toFixed(0), 8));

    //Calculate check digits
    iCHECKDIGITS =
        98 - (parseInt(ENT_CALC) +
            3 * parseInt(sTMP.charAt(14)) +
            30 * parseInt(sTMP.charAt(13)) +
            9 * parseInt(sTMP.charAt(12)) +
            90 * parseInt(sTMP.charAt(11)) +
            27 * parseInt(sTMP.charAt(10)) +
            76 * parseInt(sTMP.charAt(9)) +
            81 * parseInt(sTMP.charAt(8)) +
            34 * parseInt(sTMP.charAt(7)) +
            49 * parseInt(sTMP.charAt(6)) +
            5 * parseInt(sTMP.charAt(5)) +
            50 * parseInt(sTMP.charAt(4)) +
            15 * parseInt(sTMP.charAt(3)) +
            53 * parseInt(sTMP.charAt(2)) +
            45 * parseInt(sTMP.charAt(1)) +
            62 * parseInt(sTMP.charAt(0))) % 97;

    var _PaymentRef = this.right("000" + _SUBENTIDADE, 3) + " " + this.mid(this.right("0000" + _ID, 4), 0, 3) + " " + this.mid(this.right("0000" + _ID, 4), 3, 1) + this.right("00" + iCHECKDIGITS.toString(), 2);

    return { "entidade": _ENTIDADE, "referencia": _PaymentRef, "valor": _VALOR };
};

//Mid Function
Multibanco.prototype.mid = function(value, index, n) {
    var result = String(value).substring(index, index + n);
    return result;
};

//Right function
Multibanco.prototype.right = function(value, n) {
    var result = String(value).substring(String(value).length, String(value).length - n);
    return result;
};