String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

function salir() {
    if (!esIOS()) {
        var v_mensaje = Etiqueta(31);  //'¿Seguro que desea salir de la app?'
        var v_titulo = Etiqueta(0);    //'InfCateter'
        var v_botones = Etiqueta(32);  //'SI,NO'

        if (navigator.notification && navigator.notification.confirm) {
            navigator.notification.confirm(v_mensaje, salir1, v_titulo, v_botones);
        }
        else {
            var v_retorno = confirm(v_mensaje);
            if (v_retorno) {
                salir1(1);
            }
            else {
                salir1(2);
            }
        }
    }
}

function salir1(p_opcion) {
    if(p_opcion==1) {
    /*  if (_wathID != null) { navigator.geolocation.clearWatch(_wathID);  _wathID = null; }*/

        if (esIOS()) { }
        else {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
    }
}

function phoneGapRun() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/));
}

function esIOS() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad)/));
}

/*
function mensaje(p_idmsg,p_idtitulo,p_exc) {
    OcultarEspera();
    $.mobile.loading( "hide" );
    var v_titulo=ObtenerTexto(p_idtitulo);
    var v_texto = ObtenerTexto(p_idmsg);
    if(p_exc!=null){
        v_texto=v_texto+'\n'+p_exc;
    }
    if(phoneGapRun())
        navigator.notification.alert(v_texto, null, v_titulo);
    else
        alert(v_texto);
}*/

function aviso(nIdTitulo,nIdMensaje, sMsg) {
    var sTitulo = Etiqueta(nIdTitulo);
    var sTexto = Etiqueta(nIdMensaje);
    sTexto += " " + sMsg;
    if (phoneGapRun())
        navigator.notification.alert(sTexto, null, sTitulo);
    else {
        sTexto = sTitulo + " " + sTexto;
        alert(sTexto);
    }
}


 /*InfCateter*/
var xmlFic;
var labels = [];

//Carga array de labels según idioma
function cargaLabels(idioma)
{
    var id = "";
    var texto = "";

    leeXML(idioma, "IUtextes.xml");
    try
    {
        $(xmlFic).find('IUtextes').each(function () {
            $(this).find('label').each(function () {
                id = $(this).attr('id');
                texto = $(this).find('txt').text();
                labels.push([id,texto]);
            });
        });
    }
    catch(ex)
    {
        aviso(40,100,ex.message);
    }
}

//Devuelve la etiqueta
function Etiqueta(n)
{
    for(var x=0; x<labels.length; x++) if(labels[x][0] == n) return labels[x][1];
}

//Devuelve un objeto XML document (el XML entero)
function leeXML(idioma, fichero) {

    //DEBUG: alert("content/" + idioma + "/" + fichero);
    try
    {
        $.ajax({
            type: "GET",
            url: "content/" + idioma + "/" + fichero,
            dataType: "xml",
            success: function (xml) {
                xmlFic = xml;
            },
            error: function () {
                aviso(40,41,'');
            }, async: false
        });
    }
    catch(ex)
    {
        aviso(40,100,ex.message);
    }
}

function getPath() {
    // Get local path for Phonegap
    path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;
}

function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}


function copiaPDFs(idioma) {

    if (!esIOS()) {
        asset2sd.copyDir({
            asset_directory: "www/content/" + idioma + "/PDF",
            destination_directory: "infCateter/" + idioma
        },
            function () {
            },
            function () {
                aviso(40, 43, '');
            }
        );
    }

  //  alert('5.2');

}
