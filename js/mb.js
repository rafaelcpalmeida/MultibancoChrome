$(function() {    
    $( "#tabs" ).tabs();
    
    $( "#gerarReferencia" ).on('click', function () {
        var id = $( "#idGerar" ).val();
        var valor = $( "#valorGerar" ).val()
        
        if(valor > 0 && id > 0)
        {
            var ref = GetPaymentRef("99999", "999", id, valor);
            
            $( "#entidadeGerar" ).val(ref["entidade"]);
            $( "#referenciaGerar" ).val(ref["referencia"]);
            $( "#valorGerado" ).val(ref["valor"]);
        } else {
            alert("Deverá preencher os dois campos!");
        }
        
    });
});

function GetPaymentRef(_ENTIDADE, _SUBENTIDADE, _ID, _VALOR) {
    
    var ENT_CALC = (51 * parseInt(String(_ENTIDADE).charAt(0)) +
    73 * parseInt(String(_ENTIDADE).charAt(1)) +
    17 * parseInt(String(_ENTIDADE).charAt(2)) +
    89 * parseInt(String(_ENTIDADE).charAt(3)) +
    38 * parseInt(String(_ENTIDADE).charAt(4)));
    
    var iCHECKDIGITS = 0;
    var sTMP = "";

    sTMP = String(Right("000" + _SUBENTIDADE.toString(), 3) + Right("0000" + _ID.toString(), 4) + Right("00000000" + (parseFloat(_VALOR) * 100).toFixed(0), 8));
    	
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

    var _PaymentRef = Right("000" + _SUBENTIDADE, 3) + " " + Mid(Right("0000" + _ID, 4), 0, 3) + " " + Mid(Right("0000" + _ID, 4), 3, 1) + Right("00" + iCHECKDIGITS.toString(), 2);

    return {"entidade": _ENTIDADE, "referencia": _PaymentRef, "valor": _VALOR};
}

//Mid Function
function Mid(value, index, n)
{
    var result = String(value).substring(index, index + n);
    return result;
}
//Right function
function Right(value, n) {
    var result = String(value).substring(String(value).length, String(value).length - n);
    return result;
}

function formatAsMoney(mnt) {
    mnt -= 0;
    mnt = (Math.round(mnt * 100)) / 100;
    return (mnt == Math.floor(mnt)) ? mnt + '.00' : ((mnt * 10 == Math.floor(mnt * 10)) ? mnt + '0' : mnt);
}

function StringFormatVerify(value)
{
    var count = 0;
    var result = "";
    for (var i = 0; i <= String(value).length; i++)
    {
        if ((String(value).charAt(i) == ".") || (String(value).charAt(i) == ",")) count++;
    }
    if (count > 1) {

        for (var i = 0; i <= String(value).length; i++) {
            if (count > 1) {
                if ((String(value).charAt(i) == ".") || (String(value).charAt(i) == ",")) {
                    count--;
                }
                else { 
                    result +=String(value).charAt(i);
                }
            }
            else
            { 
                result +=String(value).charAt(i);
            }
        }

    }
    else {
        result = value;
    }
    return String(result).replace(",",".");
}
  