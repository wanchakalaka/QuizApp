console.log("Start script")

const CSS_CLASSES = {
    right_answer: "right-answer",
    wrong_answer: "wrong-answer",
    unavailable: "unavailable",
    hide: "hide"
}

const ENTITIES = {
    document: document,
    start_button: document.getElementById('start-btn'),
    next_button: document.getElementById('next-btn'),
    question_textBox: document.getElementById('question_title'),
    answer_buttons: Array.from(document.getElementById("answer-btns").children),
    game_elems: Array.from(document.getElementsByClassName("page_game")),
    start_elems: Array.from(document.getElementsByClassName("page_start"))
}

const ANSWER_OPTIONS = {
    right: "right",
    wrong: "wrong"
}

const question_retriever = {
    questions: [
        {
            "question": "Chicos, ¿en qué año es uno más uno?",
            "answers": [
                ["La respuesta es: el fantástico Ralph *ahh*", "right"],
                ["Me dijo que quemara cosas", "wrong"],
                ["El aliento de mi gato huele a comida de gato", "wrong"],
                ["Corre plátano", "wrong"]

            ]
        },
        {
            "question": "Ralph, ¿has terminado ya?",
            "answers": [
                ["Eres muy chu hu chuuuli", "wrong"],
                ["Mi gato se llama guantes", "wrong"],
                ["Terminé antes de entrar", "right"],
                ["Y vi a los bebés, y uno de ellos se me quedó mirando", "wrong"]
            ]
        }
    ]
}

class State{
    constructor(controller){
        this.controller = controller;
    }

    clickOnNext(event){}

    clickOnAnswer(selected_answer_button){}

    clickOnStart(event){}
}

class AskingState extends State{
    constructor(controller){
        super(controller);
        this.controller.clear()
        this.controller.setNextUnavailable();
        this.controller.loadNextQuestion();
    }   

    clickOnNext(event){
        this.controller.refuseShowNext(event);
    }

    clickOnAnswer(selected_answer_button){
        this.controller.state = new AnswerRevealedState(this.controller, selected_answer_button);
    }
}

class AnswerRevealedState extends State{
    constructor(controller, selected_answer_button){
        super(controller);
        this.controller.setNextAvailable();
        this.controller.revealAnswers(selected_answer_button);
    }

    clickOnNext(event){
        this.controller.state = new AskingState(this.controller);
    }
}

class StartScreenState extends State{
    constructor(controller){
        super(controller);
    }

    clickOnStart(event){
        this.controller.hideStartButton();
        this.controller.showGameButtons();
        this.controller.state = new AskingState(this.controller);
    }
}

class AnswerButtonWrapper {
    constructor(button, controller, is_answer_correct){
        this.button = button;
        this.is_answer_correct = is_answer_correct;
        this.controller = controller;
        this.button.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event){
            this.controller.clickOnAnswer(this);
    }

    reveal(){
        if(this.is_answer_correct){
            this.button.classList.add(CSS_CLASSES.right_answer);
        }
        else{
            this.button.classList.add(CSS_CLASSES.wrong_answer);
        }
    }

    clear(){
        this.button.classList.remove(CSS_CLASSES.right_answer, CSS_CLASSES.wrong_answer);
    }
}

class QuestionController{
    constructor(question_retriever, page_elements){
        this.answer_count = 4
        this.current_question = 0
        this.question_retriever = question_retriever;
        this.setEntities(page_elements);
        this.state = new StartScreenState(this);        
    }   

    setEntities(page_elements){
        this.question_textBox = page_elements.question_textBox;

        this.game_elems = page_elements.game_elems;
        this.start_elems = page_elements.start_elems;

        this.start_button = page_elements.start_button;
        this.start_button.addEventListener('click', this.clickOnStart.bind(this));

        this.next_button = page_elements.next_button;
        this.next_button.addEventListener('click', this.clickOnNext.bind(this));

        this.answer_buttons = page_elements.answer_buttons.map(
                (button) =>{
                    return new AnswerButtonWrapper(button, this, false);
                }
        )        
    }

    clickOnStart(event){
        this.state.clickOnStart(event);
    }

    clickOnNext(event){
        this.state.clickOnNext(event);
    }

    clickOnAnswer(selected_answer_button){
        this.state.clickOnAnswer(selected_answer_button);
    }
    
    refuseShowNext(event){
        // wiggle
    }


    loadNextQuestion(){
        this.loadQuestion(this.current_question++);
    }

    setNextUnavailable(){
        this.next_button.classList.add(CSS_CLASSES.unavailable);
    }

    setNextAvailable(){
        this.next_button.classList.remove(CSS_CLASSES.unavailable);
    }

    hideStartButton(){
        this.start_elems.forEach(element => {
            element.classList.add(CSS_CLASSES.hide);
        });
    }

    showGameButtons(){
        this.game_elems.forEach(element => {
            element.classList.remove(CSS_CLASSES.hide);
        });
    }

    revealAnswers(selected_answer_button){
        this.answer_buttons.forEach(answer_button => {
            if(answer_button.is_answer_correct || answer_button == selected_answer_button){
                answer_button.reveal();
            }
        });
    }

    clear(){
        this.answer_buttons.forEach(button => button.clear())
    }

    loadQuestion(ID_question){
        const question = this.question_retriever.questions[ID_question];
        this.question_textBox.innerText = question["question"];
        for(let answer_index = 0; answer_index < this.answer_count; answer_index++){
            let answer_button = this.answer_buttons[answer_index]
            let answer_content = question.answers[answer_index]
            answer_button.button.innerText = answer_content[0]
            answer_button.is_answer_correct = answer_content[1] == ANSWER_OPTIONS.right? true : false;
        }
        
    }

    answerIsCorrect(){
       // change background 
    }

    answerIsWrong(){
        // change background
    }
}

const question_controller = new QuestionController(question_retriever, ENTITIES)
