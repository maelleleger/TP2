/******************************* Les variables du quiz ***********************************/

// le numéro de la prochaine question est 0
let numeroQuestion = 0;

// le nombre de bonnes réponses
let nombreDeBonnesReponses = 0;

//La section du quiz et sa position sur l'axe des Y
let laSectionDesQuestions = document.querySelector("section");
let positionY = 100;

//Les balises pour afficher les titres des questions et les choix de réponse
let lesTitreDesQuestions = document.querySelector(".les-titre-des-questions");
let lesChoixDeReponses = document.querySelector(".les-choix-de-reponse");

//La zone pendant le quiz
let pendantLeQuiz = document.querySelector(".pendant-le-quiz");

//Le pied de page de l'intro
let piedDePage = document.querySelector("footer");

//Le pied de page de la fin
let piedDePageFin = document.querySelector(".pied-de-page-fin");

//L'intro du quiz
let intro = document.querySelector("main.intro-quiz");

//L'écran de la fin du quiz
let ecranDeFinQuiz = document.querySelector(".fin-quiz");

//la section qui contiendra le score
let sectionDuScore = document.createElement('section');

//La variable du meilleur score
let meilleurScore;
let elementMeilleurScore = document.querySelector(".meilleur-score");

/********************************** Le début du quiz *************************************/
//Gérer le meilleur score
meilleurScore = localStorage.getItem("meilleur-score") || 0;
elementMeilleurScore.innerText = meilleurScore;

//Gérer l'animation de l'intro
let titreIntro = document.querySelector(".animation-titre-intro");
//Gestionnaire d'événement pour détecter la fin de l'animation de l'intro
titreIntro.addEventListener("animationend", afficherInstructionsDuQuiz);

//La zone pendant le quiz n'est pas visible
pendantLeQuiz.style.display = "none";

/********************************* Les fonctions ***********************************/

/**
* @param {Event} event : objet AnimationEvent de l'événement distribué
*/
// fonction pour afficher les instructions
function afficherInstructionsDuQuiz(event){
    //On affiche la consigne si c'est la fin de la deuxième animation: animation-titre
    if (event.animationName == "animation-titre") {
        
        //On affiche les instructions dans le pied de page
        piedDePage.innerHTML = "<h1>Appuyez sur espace pour commencer le quiz</h1>";

        //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
        window.addEventListener("keypress", appuyezSurEspacePourCommencer);
    }
}

//fonction pour afficher les instructions du début
function appuyezSurEspacePourCommencer(event){

    //Si on appuie sur espace, le quiz commence
    if(event.charCode == 13) {
        console.log('La touche désignée a été cliquée');
    }

    else {
        commencerLeQuiz();
    }

}

//fonction pour commencer le quiz
function commencerLeQuiz(){
    
    //on enlève l'intro
    intro.remove();

    //On enlève l'écouteur qui gère le début du quiz
    window.removeEventListener("keypress", appuyezSurEspacePourCommencer);

    //On enlève l'écouteur qui gère le quiz qui recommence
    window.removeEventListener("keypress", appuyezSurEspacePourRecommencer);

    //On met le conteneur du quiz visible
    // document.querySelector(".pendant-le-quiz").style.display = "flex";
    pendantLeQuiz.style.display = "flex";

    //On affiche la première question
    afficherLesQuestions();

}


//Fonction permettant d'afficher chaque question
function afficherLesQuestions(){
    

    //Récupérer l'objet de la question en cours
    let objetDeLaQuestion = lesQuestions[numeroQuestion];

    //On affiche le titre de la question
    lesTitreDesQuestions.innerText = objetDeLaQuestion.titreDeLaQuestion;

    //On crée et on affiche les balises des choix de réponse
    //Mais d'abord on enlève le contenu actuel
    lesChoixDeReponses.innerHTML = "";

    let unChoixDeReponse;
    for (let i = 0; i < objetDeLaQuestion.choixDeReponse.length; i++){

        //On crée la balise et on y affecte une classe CSS
        unChoixDeReponse = document.createElement("div");
        unChoixDeReponse.classList.add("choix-de-reponse");
        //On intègre la valeur du choix de réponse
        unChoixDeReponse.innerText = objetDeLaQuestion.choixDeReponse[i];

        //On affecte dynamiquement l'index de chaque choix
        unChoixDeReponse.indexChoix = i;

        //On met un écouteur pour vérifier la réponse choisie
        unChoixDeReponse.addEventListener("mousedown", verifierLaReponse);

        //Enfin on affiche ce choix
        lesChoixDeReponses.append(unChoixDeReponse);
    }

    //Modifier la valeur de la position de la section sur l'axe des Y
    //pour son animation
    positionY = 100;

    //Partir la première requête pour l'animation de la section
    requestAnimationFrame(animerLaSectionDesQuestions);
}


function animerLaSectionDesQuestions(){
    //pour faire l'animation quand les nouveaux choix et questions arrivent
    //On décrémente la position de 2
    positionY -= 2;
    laSectionDesQuestions.style.transform = `translateY(${positionY}vw)`;

    //On part une autre requête  d'animation si la position n'est pas atteinte
    if (positionY > 0) {
        requestAnimationFrame(animerLaSectionDesQuestions);
    }
}


/**
 * Fonction permettant de vérifier la réponse choisie et de gérer la suite
 *
 * @param {object} event Informations sur l'événement MouseEvent distribué
 */
// fonction pour vérifier la réponse
function verifierLaReponse(event){

    let indexChoix = event.target.indexChoix;

    if(lesQuestions[numeroQuestion].laBonneReponse == indexChoix){
        nombreDeBonnesReponses++;

        //si le score est meilleur que le meilleur score, on incrémente
        if(nombreDeBonnesReponses > meilleurScore){
            localStorage.setItem("meilleur-score", nombreDeBonnesReponses);
          }

        //on cible les bonnes réponses  
        event.target.classList.add('bonne-reponse');
    }
    else{
        //on cible les mauvaises réponses  
        event.target.classList.add('mauvaise-reponse');
    }
    
    //on active le clic
    lesChoixDeReponses.classList.toggle('desactiver-clic');

    //Quand l'animation des choix de réponse finie, on passe à la prochaine question
    event.target.addEventListener("animationend", afficherLaProchaineQuestion);
}

//fonction pour afficher la prochaine question
function afficherLaProchaineQuestion(){
    //on désactive le clic
    lesChoixDeReponses.classList.toggle('desactiver-clic');
    //On incrémente lnoQuestion pour la  prochaine question à afficher
    numeroQuestion++;

    //S'il reste une question on l'affiche, sinon c'est la fin du quiz
    if (numeroQuestion < lesQuestions.length) {
        //On affiche la prochaine question
        afficherLesQuestions();
    } else {
        //C'est la fin du quiz
        afficherLaFinDuQuiz();
    }
}

//fonction pour afficher la fin du quiz
function afficherLaFinDuQuiz(){
   
    //on enlève la zone du quiz et on met celle de la fin
    pendantLeQuiz.style.display = "none";
    ecranDeFinQuiz.style.display = "flex";
    
    //on affiche le score
    sectionDuScore.innerHTML += `<h1>Votre score est de : ${nombreDeBonnesReponses}/6</h1>`

    //on affiche le meilleur score
    sectionDuScore.innerHTML += `<h2>Votre meilleur score est de : ${meilleurScore}/6</h2>`

    sectionDuScore.classList.add("score");

    ecranDeFinQuiz.append(sectionDuScore);

    //quand l'animation du score fini, on affiche les instructions de la fin
    sectionDuScore.addEventListener("animationend", afficherInstructionsFinQuiz);
    
}


/**
* @param {Event} event : objet AnimationEvent de l'événement distribué
*/
// fonction pour afficher les instructions de la fin
function afficherInstructionsFinQuiz(event){


     //On affiche les instructions dans le pied de page
     piedDePageFin.innerHTML = "<h1>Appuyez sur espace pour recommencer le quiz</h1>";

     //On met un écouteur sur la fenêtre pour recommencer
     window.addEventListener("keypress", appuyezSurEspacePourRecommencer);
}

//fonction pour recommencer le quiz avec espace
function appuyezSurEspacePourRecommencer(event){
    if(event.charCode == 13) {
        console.log('La touche désignée a été cliquée');
    }

    else {
        recommencerLeQuiz();
    }
}

//fonction qui fait recommencer le jeu
function recommencerLeQuiz(){
    //on affiche la zone du quiz et on enlève celle de la fin
    pendantLeQuiz.style.display = "flex";
    ecranDeFinQuiz.style.display = "none";

    //on réinitialise les variables
    numeroQuestion = 0; 
    nombreDeBonnesReponses = 0;

    //on enlève le score
    sectionDuScore.classList.remove("score");

    //on affiche les questions
    afficherLesQuestions();
}
