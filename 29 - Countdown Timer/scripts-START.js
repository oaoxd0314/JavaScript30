let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds){
    clearInterval(countdown);

    const now = Date.now()
    const then = now + seconds * 1000 
    console.log({now,then})

    displayTimeLeft(seconds)
    displayEndTime(then)

    countdown = setInterval(()=>{
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it!
        if(secondsLeft < 0) {
          clearInterval(countdown);
          return;
        }

        displayTimeLeft(secondsLeft)
    },1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    document.title = display;

    // textContent to show content inside this element
    timerDisplay.textContent = display
}  

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();


    endTime.textContent = `我在 ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} 回來`;
}


function startTimer(){
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// find form "customForm" and add submit event
document.customForm.addEventListener('submit', function(e) {
    // prevent refresh
    e.preventDefault();

    // this -> form it's self
    // get the field "minutes" value 
    const mins = this.minutes.value;
    timer(mins * 60);

    // clear form
    this.reset();
  });