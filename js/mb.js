$(function () {
    $("#tabs").tabs();

    $("#dataForm").dialog({
        autoOpen: false,
        buttons: {
            "Ok": function () {
                $(this).dialog("close");
            },
        }
    });

    chrome.storage.local.get('mbEntidade', function (items) {
        $("#entidadeConfiguracao").val(items.mbEntidade);
    });

    chrome.storage.local.get('mbSubentidade', function (items) {
        $("#subentidadeConfiguracao").val(items.mbSubentidade);
    });

    $("#gerarReferencia").on('click', function () {
        $("#messageGerar").empty();

        var id = $("#idGerar").val();
        var valor = $("#valorGerar").val()

        var entidade;
        var subentidade;
        var attempts = 0;

        entidade = chrome.storage.local.get('mbEntidade', function (items) {
            (function waitForEntidade() {
                entidade = items.mbEntidade;
                if (entidade > 0) {
                } else {
                    if (attempts < 5) {
                        setTimeout(waitForEntidade, 500);
                        attempts++;
                    } else {
                        clearTimeout(waitForEntidade);
                    }
                }
            })();
        });

        chrome.storage.local.get('mbSubentidade', function (items) {
            (function waitForSubentidade() {
                subentidade = items.mbSubentidade;
                if (subentidade > 0) {
                } else {
                    if (attempts < 5) {
                        setTimeout(waitForSubentidade, 500);
                        attempts++;
                    } else {
                        clearTimeout(waitForSubentidade);
                    }
                }
            })();
        });


        (function waitForReadyState() {
            if (entidade > 0 && subentidade > 0) {
                if (valor > 0 && id > 0 && entidade > 0 && subentidade > 0) {
                    if (valor < 999999) {
                        var ref = GetPaymentRef(entidade, subentidade, id, valor);

                        $("#entidadeGerar").val(ref["entidade"]);
                        $("#referenciaGerar").val(ref["referencia"]);
                        $("#valorGerado").val(ref["valor"]);
                    } else {
                        $("#messageGerar").text("Valor máximo 999999!").css("color", "#FF0000");
                    }
                } else {
                    $("#messageGerar").text("Campos em falta!").css("color", "#FF0000");
                }
            } else {
                if (attempts < 5) {
                    setTimeout(waitForReadyState, 500);
                } else {
                    clearTimeout(waitForReadyState);
                    $("#messageGerar").text("Campos em falta!").css("color", "#FF0000");
                }
            }
        })();
    });

    $("#copiarReferencia").on('click', function () {
        if ($("#entidadeGerar").val() != "" && $("#referenciaGerar").val() != "" && $("#valorGerado").val() != "") {
            var refStr = "Entidade: " + $("#entidadeGerar").val() + "\nReferência: " + $("#referenciaGerar").val() + "\nValor: " + $("#valorGerado").val() + "€";
            $("#data").empty();
            $("#data").text($("#data").text() + refStr);
            $("#dataForm").dialog("open");
            $("#data").select();
        }
    });

    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $("#dataForm").dialog("close");
        }
    });

    $("#verificarReferencia").on('click', function () {
        $("#messageVerificar").empty();

        var entidade = $("#entidadeVerifica").val();
        var referencia = $("#referenciaVerifica").val();
        var valor = $("#valorVerifica").val();

        if (entidade > 0 && referencia > 0 && valor > 0) {

            var subentidade = referencia.substring(0, 3);
            var id = referencia.substring(3, 7);

            var referenciaGerada = GetPaymentRef(entidade, subentidade, id, valor);

            if (referencia.replace(/\s/g, "") == referenciaGerada["referencia"].replace(/\s/g, "")) {
                $("#messageVerificar").text("Referência válida").css("color", "#007F00");
            } else {
                $("#messageVerificar").text("Referência inválida").css("color", "#FF0000");
            }
        } else {
            $("#messageVerificar").text("Campos em falta!").css("color", "#FF0000");
        }
    });

    $("#guardarDados").on('click', function () {
        $("#messageGuardar").empty();

        var entidade = $("#entidadeConfiguracao").val();
        var subentidade = $("#subentidadeConfiguracao").val();

        if (entidade > 0 && subentidade > 0 && entidade.length == 5 && subentidade.length == 3) {
            chrome.storage.local.set({ 'mbEntidade': entidade }, function () { });
            chrome.storage.local.set({ 'mbSubentidade': subentidade }, function () { });
        } else {
            $("#messageGuardar").text("Campos em falta!").css("color", "#FF0000");
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

    return { "entidade": _ENTIDADE, "referencia": _PaymentRef, "valor": _VALOR };
}

//Mid Function
function Mid(value, index, n) {
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

function StringFormatVerify(value) {
    var count = 0;
    var result = "";
    for (var i = 0; i <= String(value).length; i++) {
        if ((String(value).charAt(i) == ".") || (String(value).charAt(i) == ",")) count++;
    }
    if (count > 1) {

        for (var i = 0; i <= String(value).length; i++) {
            if (count > 1) {
                if ((String(value).charAt(i) == ".") || (String(value).charAt(i) == ",")) {
                    count--;
                }
                else {
                    result += String(value).charAt(i);
                }
            }
            else {
                result += String(value).charAt(i);
            }
        }

    }
    else {
        result = value;
    }
    return String(result).replace(",", ".");
}
