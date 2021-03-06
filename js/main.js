$(function () {
    var mb = new Multibanco();
    
    $("#tabs").tabs();

    $("#dataForm").dialog({
        autoOpen: false,
        buttons: {
            "Ok": () => {
                $(this).dialog("close");
            },
        }
    });

    chrome.storage.local.get("mbEntidade", function (items) {
        $("#entidadeConfiguracao").val(items.mbEntidade);
    });

    chrome.storage.local.get("mbSubEntidade", function (items) {
        $("#subentidadeConfiguracao").val(items.mbSubEntidade);
    });

    $("#gerarReferencia").on("click", function () {
        $("#messageGerar").empty();

        var id = $("#idGerar").val();
        var valor = $("#valorGerar").val();

        var entidadeGuardada;
        var subEntidadeGuardada;

        entidadeGuardada = new Promise(function (resolve, reject) {
            chrome.storage.local.get("mbEntidade", function (items) {
                resolve(items.mbEntidade);
            });
        });

        subEntidadeGuardada = new Promise(function (resolve, reject) {
            chrome.storage.local.get("mbSubEntidade", function (items) {
                resolve(items.mbSubEntidade);
            });
        });

        Promise.all([entidadeGuardada, subEntidadeGuardada]).then(function (result) {
            var entidade = result["0"];
            var subEntidade = result["1"];

            if (valor > 0 && id > 0 && entidade > 0 && subEntidade > 0) {
                if (valor < 999999) {
                    var ref = mb.getPaymentRef(entidade, subEntidade, id, valor);

                    $("#entidadeGerar").val(ref["entidade"]);
                    $("#referenciaGerar").val(ref["referencia"]);
                    $("#valorGerado").val(ref["valor"]);
                } else {
                    $("#messageGerar").text("Valor máximo 999999!").css("color", "#FF0000");
                }
            } else {
                $("#messageGerar").text("Campos em falta!").css("color", "#FF0000");
            }
        });
    });

    $("#copiarReferencia").on("click", function () {
        if ($("#entidadeGerar").val() !== "" && $("#referenciaGerar").val() !== "" && $("#valorGerado").val() !== "") {
            var refStr = "Entidade: " + $("#entidadeGerar").val() + "\nReferência: " + $("#referenciaGerar").val() + "\nValor: " + $("#valorGerado").val() + "€";
            $("#data").empty();
            $("#data").text($("#data").text() + refStr);
            $("#dataForm").dialog("open");
            $("#data").select();
        }
    });

    $("#data").keypress(function (e) {
        if (e.which === 13) {
            $("#dataForm").dialog("close");
        }
    });

    $("#verificarReferencia").on("click", function () {
        $("#messageVerificar").empty();

        var entidade = $("#entidadeVerifica").val();
        var referencia = $("#referenciaVerifica").val();
        var valor = $("#valorVerifica").val();

        if (entidade > 0 && referencia > 0 && valor > 0) {

            var subEntidade = referencia.substring(0, 3);
            var id = referencia.substring(3, 7);

            var referenciaGerada = mb.getPaymentRef(entidade, subEntidade, id, valor);

            if (referencia.replace(/\s/g, "") === referenciaGerada["referencia"].replace(/\s/g, "")) {
                $("#messageVerificar").text("Referência válida").css("color", "#007F00");
            } else {
                $("#messageVerificar").text("Referência inválida").css("color", "#FF0000");
            }
        } else {
            $("#messageVerificar").text("Campos em falta!").css("color", "#FF0000");
        }
    });

    $("#guardarDados").on("click", function () {
        $("#messageGuardar").empty();

        var entidade = $("#entidadeConfiguracao").val();
        var subEntidade = $("#subentidadeConfiguracao").val();

        if (entidade > 0 && subEntidade > 0 && entidade.length === 5 && subEntidade.length === 3) {
            chrome.storage.local.set({ "mbEntidade": entidade });
            chrome.storage.local.set({ "mbSubEntidade": subEntidade });

            $("#messageGuardar").text("Guardado com sucesso!").css("color", "#007F00");
        } else {
            $("#messageGuardar").text("Campos em falta!").css("color", "#FF0000");
        }
    });

});
