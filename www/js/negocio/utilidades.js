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


function ORIGINAL_copiaPDFs(idioma) {
    if(!esIOS())
    {
        asset2sd.copyDir({
                asset_directory: "www/content/" + idioma + "/PDF",
                destination_directory: "infCateter/" + idioma
            },
            function () {
            },
            function () {
                aviso(40,43,'');
            }
        );
   }
}

//function copiaPDFs(idioma) {
//    alert('anem a copiar els fitxers');
//    if (!esIOS()) {
//        //$cordovaFile.copyDir
        
//        var file = new File();
        
//        file.copyDir(cordova.file.dataDirectory, "www/content/" + idioma + "/PDF", cordova.file.tempDirectory, "infCateter/" + idioma)
//     .then(function (success) {
//         // success
//         alert('fitxers copiats');
//     }, function (error) {
//         // error
//         alert('no hem copiat res');
//         //aviso(40, 43, '');
//     });

//    }
//}

var sIdioma;
var root;
function copiaPDFs(idioma) {
    sIdioma = idioma;
    alert('anem a copiar els fitxers');
    if (!esIOS()) {
        //alert(cordova.file.applicationDirectory);
        //alert(cordova.file.applicationStorageDirectory);
        //alert(cordova.file.documentsDirectory);
        //alert(cordova.file.dataDirectory);
        //alert(cordova.file.externalRootDirectory);
        //alert(cordova.file.externalDataDirectory);
        //alert(cordova.file.externalApplicationStorageDirectory);

        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function (dir) {
                var srcDir = "www/content/" + idioma + "/PDF";
                dir.getDirectory(srcDir, { create: false }, getDirectoryWin, getDirectoryFail);
         });

//        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
//          function (fileSystem) {
//              root = fileSystem.root;
//              var srcDir = cordova.file.externalApplicationStorageDirectory + "www/content/" + idioma + "/PDF/";
//alert('srcDir:' + srcDir);
//              root.getDirectory(srcDir, { create: false }, getDirectoryWin, getDirectoryFail);
//          });

    }
}


// the directory param should be a DirectoryEntry object that points to the srcDir    
function getDirectoryWin(directory){
    alert('got the directory');

    // path to the parent directory that holds the dir that we want to copy to
    // we'll set it as the root, but otherwise you'll
    // need parentDir be a DirectoryEntry object
    var parentDir = root;

    // name of the destination directory within the parentDir
    var dstDir = 'infCateter/' + sIdioma; 

    // use copyWin/copyFail to launch callbacks when it works/fails
    directory.copyTo(root, dstDir, copyWin, copyFail);
}

function getDirectoryFail(){
    alert("I failed at getting a directory");
}

function copyWin(){
   alert('Copying worked!');
}

function copyFail(){
    alert('I failed copying');
}