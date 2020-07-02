var mysql = require('mysql');
var bd = require("./bd.js");

var gestionPage = require("./gestionPage.js");

var questionnaireManager = {

    afficherQuestions : function(){
        bd.connexion();
        var req = "SELECT idquestion, nomQuestionnaire, description, reponseA, reponseB, reponseC, reponseD, bonneReponse from question inner join questionnaire on question.idquestionnaire = questionnaire.idquestionnaire";
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            var txt ="";
            for(var question of results){
                txt +="<tr>";
                    txt +='<th scope="row">'+question['idquestion']+'</th>';
                    txt +='<td>'+question['nomQuestionnaire']+'</td>';
                    txt +='<td>'+question['description']+'</td>';
                    txt +='<td>'+question['reponseA']+'</td>';
                    txt +='<td>'+question['reponseB']+'</td>';
                    txt +='<td>'+question['reponseC']+'</td>';
                    txt +='<td>'+question['reponseD']+'</td>';
                    txt +='<td>'+question['bonneReponse']+'</td>';
                    txt +='<td>';
                        txt += '<form method="POST" action="modificationQuestion.html">';
                            txt += '<input type="hidden" name="idQuestion" value="'+question['idquestion']+'" />';
                            txt += '<button type="submit" class="buttonIMG">';
                                txt += '<img src="edit.png" />';
                            txt += '</button>';
                        txt += '</form>';
                    txt += '</td>';
                    txt +='<td>';
                        txt += '<form method="POST" action="suppressionQuestion.html">';
                            txt += '<input type="hidden" name="idQuestion" value="'+question['idquestion']+'" />';
                            txt += '<button type="submit" class="buttonIMG">';
                                txt += '<img src="delete.png" />';
                            txt += '</button>';
                        txt += '</form>';
                    txt += '</td>';
                txt +='</tr>';
            }
            var alertSup ="";
            if(gestionPage.queryString.suppr === "yes"){
                alertSup += '<div class="alert alert-success" role="alert">';
                alertSup += 'La question a bien été supprimée';
                alertSup += '</div>';
            }
            var alertModif ="";
            if(gestionPage.queryString.modif === "yes"){
                alertModif += '<div class="alert alert-success" role="alert">';
                alertModif += 'La question a bien été modifiée';
                alertModif += '</div>';
            }
            gestionPage.objetToSupplant.supMessage = alertSup;
            gestionPage.objetToSupplant.modifMessage = alertModif;
            gestionPage.objetToSupplant.Questions = txt;
            gestionPage.envoyerDataToUser();
        });
        bd.deconnexion();
    },

    afficherQuestionnaire : function(){
        bd.connexion();
        var req = "select q1.idquestionnaire, nomQuestionnaire,descriptionQuestionnaire, count(idquestion) as 'nbQuestion' from questionnaire q1 left join question q2 on q1.idquestionnaire = q2.idquestionnaire group by q1.idquestionnaire, nomQuestionnaire,descriptionQuestionnaire";
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            var txt ="";
            for(var questionnaire of results){
                txt +="<tr>";
                    txt +='<th scope="row">'+questionnaire['idquestionnaire']+'</th>';
                    txt +='<td>'+questionnaire['nomQuestionnaire']+'</td>';
                    txt +='<td>'+questionnaire['descriptionQuestionnaire']+'</td>';
                    txt +='<td>'+questionnaire['nbQuestion']+'</td>';
                    txt +='<td>';
                        txt += '<form method="POST" action="modificationQuestionnaire.html">';
                            txt += '<input type="hidden" name="idQuestionnaire" value="'+questionnaire['idquestionnaire']+'" />';
                            txt += '<button type="submit" class="buttonIMG">';
                                txt += '<img src="edit.png" />';
                            txt += '</button>';
                        txt += '</form>';
                    txt += '</td>';
                    txt +='<td>';
                        txt += '<form method="POST" action="suppressionQuestionnaire.html">';
                            txt += '<input type="hidden" name="idQuestionnaire" value="'+questionnaire['idquestionnaire']+'" />';
                            txt += '<button type="submit" class="buttonIMG">';
                                txt += '<img src="delete.png" />';
                            txt += '</button>';
                        txt += '</form>';
                    txt += '</td>';
                txt +='</tr>';
            }
            var alertSup ="";
            if(gestionPage.queryString.suppr === "yes"){
                alertSup += '<div class="alert alert-success" role="alert">';
                alertSup += 'Le questionnaire a bien été supprimé';
                alertSup += '</div>';
            }
            var alertModif ="";
            if(gestionPage.queryString.modif === "yes"){
                alertModif += '<div class="alert alert-success" role="alert">';
                alertModif += 'Le questionnaire a bien été modifié';
                alertModif += '</div>';
            }
            gestionPage.objetToSupplant.supMessage = alertSup;
            gestionPage.objetToSupplant.modifMessage = alertModif;
            gestionPage.objetToSupplant.Questionnaires = txt;
            gestionPage.envoyerDataToUser();
        });
        bd.deconnexion();
    },

    gererCreationQuestions : function(){
        bd.connexion();
        var req = "SELECT * from questionnaire";
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            var optionTxt = "";
            for(var ligne of results){
                optionTxt += "<option value='"+ ligne.idquestionnaire+"'>";
                optionTxt += ligne.nomQuestionnaire + " : " + ligne.descriptionQuestionnaire;
                optionTxt += "</option>";
            }
            var validation = "";
            if(gestionPage.queryString.confirm === "yes"){
                validation += '<div class="alert alert-success" role="alert">';
                validation += 'La question a bien été créée en BD';
                validation += '</div>';
            }
            gestionPage.objetToSupplant.validationSaisie = validation;
            gestionPage.objetToSupplant.optionQuestionnaires = optionTxt;
            gestionPage.envoyerDataToUser();
        });
        bd.deconnexion();
    },

    gererCreationQuestionnaire : function(){
        var validation = "";
        if(gestionPage.queryString.confirm === "yes"){
            validation += '<div class="alert alert-success" role="alert">';
            validation += 'La question a bien été créée en BD';
            validation += '</div>';
        }
        gestionPage.objetToSupplant.validationSaisie = validation;
        gestionPage.envoyerDataToUser();
    },

    creerQuestionBD : function(info){
        bd.connexion();
        var req = "insert into question (description,reponseA,reponseB,reponseC,reponseD,bonneReponse,idquestionnaire) value (?,?,?,?,?,?,?);";
        bd.instance.query(req, [info.question, info.reponseA, info.reponseB, info.reponseC, info.reponseD, info.bonneReponse, parseInt(info.questionnaire)] , function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='creerQuestion.html?confirm=yes'</script>")
        });
        bd.deconnexion();
    },

    creerQuestionnaireBD : function (info){
        bd.connexion();
        var req = "insert into questionnaire (nomQuestionnaire,descriptionQuestionnaire) value (?,?);";
        bd.instance.query(req, [info.questionnaire, info.description] , function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='creerQuestionnaire.html?confirm=yes'</script>")
        });
        bd.deconnexion();
    },

    supprimerQuestionnaireBD : function(info){
        bd.connexion();
        var req = "delete from questionnaire where idQuestionnaire = ?;";
        bd.instance.query(req, [info.idQuestionnaire] , function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestionnaire.html?suppr=yes'</script>")
        });
        bd.deconnexion();
    },

    //Gestion de la page permettant de modifier un questionnaire - Formulaire
    modifierQuestionnaire : function(info){
        bd.connexion();
        var req = "select * from questionnaire where idquestionnaire = ?";
        bd.instance.query(req, [info.idQuestionnaire], function (error, results, fields) {
            if (error) throw error;
            gestionPage.objetToSupplant.id = results[0].idquestionnaire;
            gestionPage.objetToSupplant.nomQuestionnaire = results[0].nomQuestionnaire;
            gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].descriptionQuestionnaire;
            gestionPage.envoyerDataToUser();
        });
        bd.deconnexion();
    },

    //Modification en BD d'un questionnaire
    modifierQuestionnaireBD : function(info){
        bd.connexion();
        var req = "UPDATE questionnaire SET nomQuestionnaire = ?, descriptionQuestionnaire = ? WHERE idQuestionnaire=?";
        bd.instance.query(req, [info.nomQuestionnaire, info.descriptionQuestionnaire, info.idQuestionnaire], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestionnaire.html?modif=yes'</script>")
        });
        bd.deconnexion();
    },

    supprimerQuestionBD : function(info){
        bd.connexion();
        var req = "delete from question where idquestion = ?;";
        bd.instance.query(req, [info.idQuestion] , function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestion.html?suppr=yes'</script>")
        });
        bd.deconnexion();
    },

    modifierQuestion : function(info){
        bd.connexion();
        var req = "select idquestion,description,reponseA,reponseB,reponseC,reponseD,bonneReponse, idquestionnaire from question where idquestion = ?";
        bd.instance.query(req, [info.idQuestion], function (error, results, fields) {
            if (error) throw error;
            gestionPage.objetToSupplant.id = results[0].idquestion;
            gestionPage.objetToSupplant.description = results[0].description;
            gestionPage.objetToSupplant.reponseA = results[0].reponseA;
            gestionPage.objetToSupplant.reponseB = results[0].reponseB;
            gestionPage.objetToSupplant.reponseC = results[0].reponseC;
            gestionPage.objetToSupplant.reponseD = results[0].reponseD;
            gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse;
            questionnaireManager.listeQuestionnaire(results[0].idquestionnaire);
        });
        bd.deconnexion();
    },

    listeQuestionnaire : function(idQuestionnaire){
        bd.connexion();
        var req = "select * from questionnaire";
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            var txt ="";
            for(var questionnaire of results){
                if(idQuestionnaire === questionnaire.idquestionnaire){
                    txt +="<option value ='"+questionnaire.idquestionnaire  +"' selected>";
                } else {
                    txt +="<option value ='"+questionnaire.idquestionnaire  +"'>";
                }
                txt += questionnaire.nomQuestionnaire + " - " + questionnaire.descriptionQuestionnaire ;
                txt +="</option>";
            }
            gestionPage.objetToSupplant.optionGroupe = txt;
            gestionPage.envoyerDataToUser();
        });
        bd.deconnexion();
    },

    //Modification en BD d'un question
    modifierQuestionBD : function(info){
        bd.connexion();
        var req = "UPDATE question SET description = ?, reponseA = ?,reponseB = ?,reponseC = ?,reponseD = ?,bonneReponse = ?,idquestionnaire = ? WHERE idQuestion=?";
        bd.instance.query(req, [info.description, info.reponseA, info.reponseB,info.reponseC,info.reponseD,info.bonneReponse,info.idQuestionnaire,info.idQuestion], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestion.html?modif=yes'</script>")
        });
        bd.deconnexion();
    },

    gererQuestionJeu : function(questionnaire, idQuestion){
        bd.connexion();
        var req = "select q1.idquestionnaire, nomQuestionnaire, idquestion,description,reponseA,reponseB,reponseC,reponseD,bonneReponse from question q1 inner join questionnaire q2 on q1.idquestionnaire = q2.idquestionnaire where q2.nomQuestionnaire =? limit 1 offset ?";
        bd.instance.query(req, [questionnaire, (idQuestion-1)], function (error, results, fields) {
            if(results.length <1){
                gestionPage.reponse.end("<script>document.location.href='index.html'</script>")
            } else {
                gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].nomQuestionnaire;
                gestionPage.objetToSupplant.idQuestionBD = results[0].idquestion;
                gestionPage.objetToSupplant.questionNumero = idQuestion;
                gestionPage.objetToSupplant.description = results[0].description;
                gestionPage.objetToSupplant.reponseA = results[0].reponseA;
                gestionPage.objetToSupplant.reponseB = results[0].reponseB;
                gestionPage.objetToSupplant.reponseC = results[0].reponseC;
                gestionPage.objetToSupplant.reponseD = results[0].reponseD;
                gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse;
                questionnaireManager.listeQuestionnaire(results[0].idquestionnaire);
            }   
        });
        bd.deconnexion();
    }

}
module.exports = questionnaireManager;