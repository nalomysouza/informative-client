    /**
     * Consulta o JSON dos informativos
     */
    $.getJSON("./assets/js/data.json").done(onInformative).fail(onError);

    /**
     * Recebe os dados da Consulta por JSON
     * @param {*} data 
     */
    function onInformative(data) {
        $("#informative-content").empty();

        for (i = 0; i < data.informative.length; i++) {
            $("#informative-content")
            .append("<tr><td>" + data.informative[i].id + "</td></tr>")
            .append("<tr><td>" + data.informative[i].subject + "</td></tr>")
            .append("<tr><td>" + data.informative[i].content + "</td></tr>")
            .append("<tr><td>" + data.informative[i].author + "</td></tr>")
            .append("<tr><td>" + data.informative[i].createIn + "</td></tr>")
            .append("<tr><td>" + data.informative[i].expiresIn + "</td></tr>");
        }
        createNotification('Informativo', 'Atenção: Você possui informativos importantes não lidos!');
    };

    function onError(error){
        console.log("Erro JSON Informative.js: " + error);
    };