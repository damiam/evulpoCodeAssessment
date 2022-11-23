// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted. 
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt

const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4'
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"]

// global variables
let options = []
let states = []
let current_question_index = -1
let correct_answer_index = -1
let chosen_answer_index = -1
let total_score = 0
let question_options = []
let current_question = []
let evaluated = false

// start google api client
function handleClientLoad() {
    gapi.load('client', initClient)
}

function initClient() {
	gapi.client.init({
	    apiKey: API_KEY,
	    discoveryDocs: DISCOVERY_DOCS
	}).then(function () {
	    getExerciseData()
	}, function(error) {
	    console.log(JSON.stringify(error, null, 2))
	})
}

// call API for data
function getExerciseData() {
	gapi.client.sheets.spreadsheets.values.get({
	    spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
	    range: 'Learning!A1:F10',
	}).then(function(response) {
        console.log(response.result.values[0])
        options = response.result.values.slice(1)
        let next_button = document.querySelector('#next-button')
        next_button.style.display = "block"
	}, function(response) {
		console.log('Error: ' + response.result.error.message)
	})
}

// Next question button handler 
function next_question(){
    let next_button = document.querySelector('#next-button')
    let evaluate_button = document.querySelector('#eval-button')
    let evMessage = document.querySelector('#evaluation-message')

    // if the there still are any more questions, select randomly form the remaining
    if(options.length !== 0){
        current_question_index = Math.floor(Math.random() * options.length)

        if(current_question_index !== -1){
            next_button.textContent = "Next Question"
        }

        display_question()

        // remove the question which has just been displayed
        ignore = options.splice(current_question_index, 1)
    } else {
        view_final_score()
    }
    evaluated = false
    next_button.style.display = "none"
    evaluate_button.style.display = "none"
    evMessage.innerHTML = ''
}

// Handle the build of the answers
function display_question(){
    let topic_title = document.querySelector('#subtitle')
    let optionsContainer = document.querySelector('#options-wrapper')

    current_question = options[current_question_index]

    topic_title.textContent = current_question[0]

    // remove all child nodes
    optionsContainer.innerHTML = ''

    optionsContainer.innerHTML += "<p class='question'>" + current_question[2] + "</p>"

    question_options = current_question[3].split(";")

	for(let i = 0; i < question_options.length; i++){
		optionsContainer.innerHTML+= "<div class='unchosen option' onclick=toggleChoice(" + i + ")><p class='text'>" + question_options[i] + "</p></div>"
	}

    correct_answer_index = current_question[4]
}

// Handle the visual effect of the answers when clicked
function toggleChoice(idx){
    let evaluate_button = document.querySelector('#eval-button')
    if(!evaluated){
        evaluate_button.style.display = "block"
        chosen_answer_index = idx

        let all_options = document.querySelectorAll(".option")
        for(let i = 0; i < all_options.length; i++){
            let current_choice = all_options[i]
            if(idx == i){
                current_choice.classList.add('chosen')
                current_choice.classList.remove('unchosen')
            } else {
                current_choice.classList.remove('chosen')
                current_choice.classList.add('unchosen')
            }
        }
    }
}

// Display the final stage of the form with the total score
function view_final_score(){
    let topic_title = document.querySelector('#subtitle')
    let optionsContainer = document.querySelector('#options-wrapper')
    topic_title.textContent = ''
    optionsContainer.innerHTML = ''

    topic_title.textContent = 'Congratulations! Your final score is: ' + total_score
}

// Handle the evaluate button
function myEvaluation(){
	let evMessage = document.querySelector('#evaluation-message')
    let evaluate_button = document.querySelector('#eval-button')
    let next_button = document.querySelector('#next-button')

    evaluated = true

	if(chosen_answer_index == correct_answer_index){
        evMessage.innerHTML = "<p class='success'>Correct</p>"
        total_score += Number(current_question[5])
    } else {
        evMessage.innerHTML = "<p class='failed'>Wrong, the correct asnwer was: " + question_options[correct_answer_index] + "</p>"
    }
    next_button.style.display = "block"
    evaluate_button.style.display = "none"

    if(options.length === 0){
        next_button.textContent = 'Finish'
    }
}