var navLIFO = new Array();
var itemAnterior = "";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        if(phoneGapRun()) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        else
        {
            deviceReady();
        }
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        deviceReady();
    }
};

function deviceReady() {
    try {
        var success = function(status) {
            //alert('Cache Message: ' + status);
        }

        var error = function(status) {
            //alert('Cache Error: ' + status);
        }


        if(!phoneGapRun()) {
            aviso(40,42,'');
            salir();
        }

        //Evento q se dispara cuando se pulsa el botón atrás
/*        document.addEventListener("backbutton", handleBackButton, false);*/

        //INICIO InfCateter
        copiaPDFs('es-es');
        $.doTimeout(1500, inicio());

    }
    catch(ex){
        aviso(40,100,ex.message);
    }
}

/*inicia InfCateter*/
function inicio(){
    cargaLabels('es-es');

    //titulo programa
    $("#txtHeaderTitulo").html(Etiqueta(1));

    //Menú lateral
    $("#menuversion").html(Etiqueta(0) + " v1.0");
    $("#menuInicio").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(11) + "<br/>");
    $("#menuGeneralidades").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(12) + "<br/>");
    $("#menuManejo").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(13) + "<br/>");
    $("#menuFichas").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(14) + "<br/>");
    $("#menuAcerca").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(15) + "<br/>");
    $("#menuInfo").html("&nbsp;&nbsp;&nbsp;" + Etiqueta(16) + "<br/>");
    $("#menuSalir").html(Etiqueta(17) + "<br/>");

    navLIFO.push("pageMENU|0|");

    cargaPaginaInfoCateter('es-es', 0);
    //hgs afegit abrirPagina
    //abrirPagina('pageMENU', '0', '');

    if(esIOS()) $("#liMenuSalir").attr('class', 'ui-screen-hidden');
}

function Menu() {
    $("#pageMenuLateral" ).panel().panel("open");
}


function Atras() {

    var item = "";

    try {
       
          if (navLIFO.length > 1) {
            navLIFO.pop();
            item = navLIFO.pop();
            abrirPagina(item.split("|")[0], item.split("|")[1], item.split("|")[2]);
        }
        else {
            salir();
        }
    }
    catch (ex) {
        aviso(40, 100, ex.message);
    }
}

function abrirPagina(sPag, id, titulo) {

    var nomApp = "Información sellado catéter";
    try {
        navLIFO.push(sPag + "|" + id + "|" + titulo);

        $.mobile.changePage('#' + sPag, { transition: "slide" });

        //Texto de body --> Titulo
        //  if (typeof titulo !== "undefined") $("#tituloMenu").html(titulo);
        if (typeof titulo !== "undefined")
        {
            if (titulo!=="")
            {
                $("#txtHeaderTitulo").html(titulo);
            }
            else
            {
                $("#txtHeaderTitulo").html(nomApp);
            }
        }
     


        switch (sPag) {
            case 'pageMENU':
                $.doTimeout(1500, cargaPaginaInfoCateter('es-es', id));
                break;

            case 'pageInfoXML':
                $.doTimeout(1500, inicioPaginaInfoXML());
                break;

            case 'pageFiltro':
                $.doTimeout(1500, inicioPaginaFiltro(titulo));
                break;

            case 'pageAYUDA':
                $.doTimeout(1500, inicioPaginaAyuda(titulo));
                break;

            case 'pageINFO':
                $.doTimeout(1500, inicioPaginaInfo(titulo));
                break;
        }
    }
    catch (ex) {
        aviso(40, -1, ex.message);
    }
}


//------------------------------------------------------------------------
// Evento 'patras'
//------------------------------------------------------------------------
function handleBackButton() {
}

function irAtras(){
    if (esIOS()) {
        window.history.back();
    }
    else {
        if (navigator.app) {
            navigator.app.backHistory();

        } else if (navigator.device) {
            navigator.device.backHistory();
        }
        else {
            window.history.back();
        }
    }
}

