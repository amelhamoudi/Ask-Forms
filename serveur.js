var http = require("http");
var url = require("url");
var fs = require("fs");
require("remedial");
var querystring = require("querystring");
var gestionPage = require("./js_serveur/gestionPage.js");

var questionnaireManager = require("./js_serveur/questionnaireManager.js");

var gererServeur = function(requete,reponse){
    var monUrl = url.parse(requete.url);
    var urlQueryString = querystring.parse(monUrl.query);
    var extension = monUrl.pathname.substring(monUrl.pathname.indexOf("."),monUrl.pathname.length);
    gestionPage.initialisation(monUrl, extension, requete,reponse,urlQueryString);
    
    if(requete.method==="POST"){
        var body = "";
        requete.on("data", chunk => {
            body += chunk.toString();
        });
       
        requete.on ("end", () => {
            var obj = querystring.parse(body);
            if(monUrl.pathname==="/validationCreationQuestion.html"){
                questionnaireManager.creerQuestionBD(obj);
            } else if(monUrl.pathname==="/validationCreationQuestionnaire.html"){
                questionnaireManager.creerQuestionnaireBD(obj);
            } else if(monUrl.pathname==="/suppressionQuestionnaire.html"){
                questionnaireManager.supprimerQuestionnaireBD(obj);
            } else if(monUrl.pathname==="/modificationQuestionnaire.html"){
                questionnaireManager.modifierQuestionnaire(obj);
            } else if(monUrl.pathname==="/modifierQuestionnaireBD.html"){
                questionnaireManager.modifierQuestionnaireBD(obj);
            } else if(monUrl.pathname==="/suppressionQuestion.html"){
                questionnaireManager.supprimerQuestionBD(obj);
            } else if(monUrl.pathname==="/modificationQuestion.html"){
                questionnaireManager.modifierQuestion(obj);
            } else if(monUrl.pathname==="/modifierQuestionBD.html"){
                questionnaireManager.modifierQuestionBD(obj);
            }
        })
       
    } else {
        if(gestionPage.url.pathname !== "/favicon.ico"){
            gererFichier();
        }
    }  
}

function gererFichier(){
    if(gestionPage.url.pathname ==="/" || gestionPage.extension ===".html"){ // gestion d'une page HTML
        if(gestionPage.url.pathname ==="/afficherQuestion.html"){
            questionnaireManager.afficherQuestions();
        } else  if(gestionPage.url.pathname ==="/afficherQuestionnaire.html"){
            questionnaireManager.afficherQuestionnaire();
        } else if(gestionPage.url.pathname ==="/creerQuestion.html"){
            questionnaireManager.gererCreationQuestions();
        } else if(gestionPage.url.pathname ==="/creerQuestionnaire.html"){
            questionnaireManager.gererCreationQuestionnaire();
        } else if(gestionPage.url.pathname ==="/jeu.html"){
            if(!gestionPage.queryString.idquestionnaire){
                questionnaireManager.gererQuestionJeu("Chats",1);
            } else {
                if(!gestionPage.queryString.idquestion){
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire,1);
                } else {
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire,gestionPage.queryString.idquestion);
                }
            }
        }
         else {
            gestionPage.envoyerDataToUser();
        }
        
    } else {
        gestionPage.envoyerDataToUser();
    }
}

var serveur = http.createServer(gererServeur);
serveur.listen(8080);