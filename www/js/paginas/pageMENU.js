var textoXML = "";
var tituloXML = "";
var miIdPadre="";

/* Muestra un PDF del directorio del sistema (sdcard/infCateter) */
function paginaInfoPDF(idioma,fichero){
    var ruta = "";
    var fic = "";
    try
    {
        if(esIOS())
        {
            ruta = window.location.href;
            ruta = ruta.substr(0,ruta.lastIndexOf('/'));
            fic = ruta + "/content/" + idioma + "/PDF/" + fichero;
            window.open(fic, '_blank' ,'location=no' );
        }
        else {
            ruta = "file:///sdcard/infCateter/" + idioma + "/";
            fic = ruta + fichero;
            window.plugins.fileOpener.open(fic);
        }
    }
    catch(ex)
    {
        aviso(40,-1,ex.message);
    }
}

/* Muestra el texto XML a partir de Textes.xml */
function inicioPaginaInfoXML() {
    $('#divTituloXML').html(tituloXML);
    $('#divInfoXML').html(textoXML);
}

/* Lee el texto XML de Textes.xml según idioma */
function paginaInfoTXT(idioma,id, titulo){
    leeXML(idioma , "Textes.xml");

    try
    {
        $(xmlFic).find('menu').each(function () {
            $(this).find('itemMenu').each(function () {
                if(id == $(this).attr('id')) {
                    tituloXML = titulo;
                    textoXML = $(this).find('txt').text();
                    abrirPagina("pageInfoXML",false,'');
                }
            });
        });

    }
    catch(ex)
    {
        aviso(40,-1,ex.message);
    }
}

function paginaFiltroFichas(idioma,id, titulo) {
    abrirPagina("pageFiltro",false,titulo);
}

function inicioPaginaFiltro(titulo) {
    $('#divTituloFiltro').html(titulo);
    $('#labelFiltro').html(Etiqueta(20));
    $('#botonBuscar').text(Etiqueta(21));
    $("#ulFichas").empty();
}

function filtroFichas(idioma){
    var items="";
    var nomFarmaco = "";
    var fic = "";
    var sFiltro = $("#inputFiltro").val().toUpperCase();
    var img = "";

    $("#ulFichas").empty();

    leeXML(idioma,'Farmacos.xml');
    try
    {
        $(xmlFic).find('farmacos').each(function () {
            $(this).find('farmaco').each(function () {
                nomFarmaco = $(this).attr('nom').toUpperCase();
                if(nomFarmaco.indexOf(sFiltro) != -1) {
                    fic = $(this).find('fic').text();
                    img = "<img src='images/pdf.png' onclick=\"paginaInfoPDF('" + idioma + "','" + fic + "')\" >";
                    items += "<li>";
                    items += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
                    items += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
                    items += img;
                    items += "</td><td style='width: 95%; vertical-align: middle;'>";
                    items += "<a href='#' style='text-decoration:none;' onclick=\"paginaInfoPDF('" + idioma + "','" + fic + "')\" >";
                    items += "<font style='white-space:normal;'>";
                    items += nomFarmaco;
                    items += "</font></a></td></tr></table></div></li>";
                    /*antes : items += "<li><a href='#' style='text-decoration:none;' onclick=\"paginaInfoPDF('" + idioma + "','" + fic + "')\" >" + nomFarmaco + "</a></li>";*/
                }
            });
        });
        $("#ulFichas").append(items).listview('refresh');
    }
    catch(ex)
    {
        aviso(40,-1,ex.message);
    }
}

function inicioPaginaAyuda(titulo) {
    $('#divTituloAyuda').html(titulo);
    $("#iconoAyuda").attr("class","ui-btn ui-corner-all ui-icon-comment ui-btn-icon-notext");
}

function inicioPaginaInfo(titulo) {
    $('#divTituloInfo').html(titulo);
    $("#iconoInfo").attr("class","ui-btn ui-corner-all ui-icon-info ui-btn-icon-notext");
}

function volverInicio(sPag, id, titulo){
    navLIFO=[];
    abrirPagina(sPag, id, titulo );
    $("#pageMenuLateral").panel("close");
}

function cargaPaginaInfoCateter(idioma, idPadreSel) {
    var menu = leeXML(idioma,'menu.xml');
    var img = "";
    var id, idPadre,idPadreAnt,titol, tieneLink, nivel, nivelAnt, esPadre;
    var bPrimero = true;
    var nCierres = 0;
    var contenido = "";
    var sFiltro = "";
    var sItem = "";
    var sBotones = "";
    idPadreAnt = -1;
    nivelAnt = -1;

    var nIdAcordeon = 0;

    $("#ulMenu").empty();
    $("#menuAcordeon").empty();

    try
    {
        $(xmlFic).find('menu').each(function () {
            $(this).find('itemMenu').each(function () {
                idPadre = $(this).find('idPadre').text();

                if (idPadre == idPadreSel) {
                    sItem = "";
                    id = $(this).attr('id');
                    titol = $(this).find('titol').text();
                    tieneLink = $(this).find('ficAsociado').text();
                    nivel = $(this).find('nivel').text();
                    esPadre = $(this).find('esPadre').text();
                    img = "";

                    if(esPadre==1)
                    {
                        if(nivel=='INI-ACORDEON'){
                            xmlFic = null;
                            idPadreSel = -1;
                            CargaArcodeon(id, idioma);
                        }
                        else
                        {
                            if (idPadre == 0)
                                sItem = tipoItem('DESPLEGA_NO_PADRE',idioma,id,titol);
                            else
                                sItem = tipoItem('DESPLEGA_SI_PADRE',idioma,id,titol);

                            $("#ulMenu").append(sItem).listview('refresh');
                        }
                    }
                    else
                    {
                        sItem = tipoItem(tieneLink,idioma,id,titol);
                        $("#ulMenu").append(sItem).listview('refresh');
                    }
                }

                nivelAnt = nivel;

            });
        });

    }
    catch(ex)
    {
        aviso(40,-1, ex.message);
    }
}

function tipoItem(sTipo,idioma,id,titol){
    var sItem = "";
    var img = "";

    switch(sTipo)
    {
        case 'DESPLEGA_SI_PADRE' :
            img = "<img src='images/desplega.png' onclick=\"abrirPagina('pageMENU','" + id + "','" + titol + "')\">";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<a href='#' style='text-decoration:none;' onclick=\"abrirPagina('pageMENU','" + id + "','" + titol + "')\">";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></a></td></tr></table></div></li>";
            break;

        case 'DESPLEGA_NO_PADRE' :
            img = "<img src='images/seccion.png' onclick=\"abrirPagina('pageMENU','" + id + "','" + titol + "')\">";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<a href='#' style='text-decoration:none;' onclick=\"abrirPagina('pageMENU','" + id + "','" + titol + "')\">";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></a></td></tr></table></div></li>";
            break;

        case 'TXT':  //link a un Texto de Textes.xml ***********************************************
            img = "<img src='images/text.png' onclick=\"paginaInfoTXT('" + idioma + "','" + id + "','" + titol + "')\">";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<a href='#' style='text-decoration:none;' onclick=\"paginaInfoTXT('" + idioma + "','" + id + "','" + titol + "')\"> ";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></a></td></tr></table></div></li>";
            break;

        case '':  //no hay link, es sólo para leer *************************************************
            img = "<img src='images/itemFinal.png'>";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></td></tr></table></div></li>";
            break;

        case 'FILTRO':  //Buscador de fichas *******************************************************
            img = "<img src='images/lupa.png' onclick=\"paginaFiltroFichas('" + idioma + "','" + id + "','" + titol + "')\">";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<a href='#' style='text-decoration:none;' onclick=\"paginaFiltroFichas('" + idioma + "','" + id + "','" + titol + "')\"> ";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></a></td></tr></table></div></li>";
            break;

        default:  //link al fichero PDF especificado ***********************************************
            img = "<img src='images/pdf.png' onclick=\"paginaInfoPDF('" + idioma + "','" + sTipo + "')\" >";
            sItem += "<li>";
            sItem += "<div style='width: 100%; height:100%;  vertical-align: middle;' class='mi-fondoPaginaTXT'>";
            sItem += "<table width='100%' height='100%' class='mi-fondoPaginaTXT'><tr><td style='width: 5%; vertical-align: middle; text-align: left;'>";
            sItem += img;
            sItem += "</td><td style='width: 95%; vertical-align: middle;'>";
            sItem += "<a href='#' style='text-decoration:none;' onclick=\"paginaInfoPDF('" + idioma + "','" + sTipo + "')\" >";
            sItem += "<font style='white-space:normal;'>";
            sItem += titol;
            sItem += "</font></a></td></tr></table></div></li>";
            break;
    }
    return sItem;
}

function CargaArcodeon(idInicial, idioma)
{
    $("#menuAcordeon").empty();

    var menu = leeXML(idioma,'menu.xml');

    //El idInicial es el primero (cabecera acordeón)
    //a partir de éste crear arcordeon con todos los que tengan nivel='ACORDEON'
    var contenidoAcordeon  = "<div data-role='collapsibleset' id='menuAcordeon' data-iconpos='left' data-theme='b' data-content-theme='b' data-collapsed-icon='arrow-d' data-expanded-icon='arrow-u'>";
    var id = "";
    var bEmpezar = false;
    var bIniciado = false;
    var nivel = "";
    var titol = "";
    var esPadre = "";
    var idPadre = "";
    var tieneLink = "";
    var nPadreAnt = 0;
    var idAnt = 0;
    var cierreUL = 0;
    var cierreDIV = 0;
    var cierreLI = 0;
    var nPadreInicial = -1;
    var sItem = "";
    var img = "";

    $(xmlFic).find('menu').each(function () {
        $(this).find('itemMenu').each(function () {
            id = $(this).attr('id');
            nivel = $(this).find('nivel').text();
            titol = $(this).find('titol').text();
            esPadre = $(this).find('esPadre').text();
            idPadre = $(this).find('idPadre').text();
            tieneLink = $(this).find('ficAsociado').text();

            if (id == idInicial) nPadreInicial = idPadre;

            if (idPadre == nPadreInicial)
            {
                if(cierreLI > 0)  contenidoAcordeon += "</li>";
                if(cierreUL > 0)  contenidoAcordeon += "</ul>";
                if(cierreDIV > 0)  contenidoAcordeon += "</div>";

                contenidoAcordeon += "<div data-role='collapsible'>";
                contenidoAcordeon += "<h3>" + titol + "</h3>";
                contenidoAcordeon += "<ul data-role='listview' data-inset='false'>";

                bIniciado = true;
                bEmpezar = true;
                idAnt = id;

                cierreDIV = 1;
                cierreUL = 1;
            }
            else
            {
                if(bEmpezar)
                {
                    if(nivel == 'ACORDEON') {
                        if (esPadre == 1) {
                            if(idPadre != nPadreAnt)
                            {
                                if(cierreLI > 0) { contenidoAcordeon += "</li>"; cierreLI -= 1; }
                                if(cierreDIV > 0) { contenidoAcordeon += "</div>"; cierreDIV -= 1; }
                                if(cierreUL > 0) { contenidoAcordeon += "</ul>"; cierreUL -= 1; }
                            }
                            contenidoAcordeon += "<li>";                                        cierreLI += 1;
                            contenidoAcordeon += "<div data-role='collapsible'>";               cierreDIV += 1;
                            contenidoAcordeon += "<h3>" + titol + "</h3>";
                            contenidoAcordeon += "<ul data-role='listview' data-inset='false'>"; cierreUL += 1;

                        }
                        else
                        {
                            sItem = tipoItem(tieneLink,idioma,id,titol);
                            contenidoAcordeon += sItem ;
                        }
                    }
                    else
                    {
                        if(nivel == 'FIN-ACORDEON') {
                            sItem = tipoItem(tieneLink,idioma,id,titol);
                            contenidoAcordeon += sItem ;

                            contenidoAcordeon += "</ul>";
                            contenidoAcordeon += "</div>";
                            bEmpezar = false;
                        }
                    }

                    idAnt = id;
                    nPadreAnt = idPadre;
                }
                else
                {
                    if(bIniciado) {
                        if(cierreLI > 0)  contenidoAcordeon += "</li>";
                        if(cierreUL > 0)  contenidoAcordeon += "</ul>";
                        if(cierreDIV > 0) contenidoAcordeon += "</div>";

                        contenidoAcordeon += "</div>"; //cierre del <div data-role='collapsibleset>

                        $("#ulMenu").append("<p><li>" +  contenidoAcordeon + "</li></p>").listview('refresh');
                        $('div[data-role=collapsible]').collapsible();

                        /*$("#menuAcordeon").append(contenidoAcordeon).collapsibleset('refresh');*/

                        bIniciado = false;
                    }
                }
            }
        });
    });
}




