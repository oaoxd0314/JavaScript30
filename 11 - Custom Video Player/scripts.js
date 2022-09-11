const player = document.querySelector('.player') // main element ( frame ) 
const video = player.querySelector('.player__video'); // video instance( <video> )
const progress = player.querySelector('.progress'); // progress wrapper
const progressBar = player.querySelector('.progress__filled'); // now playing progress
const mainButton = player.querySelector('.toggle'); // main action button toggle playing | pause
const skipButtons = player.querySelectorAll('[data-skip]'); 
// element array => it's select data attritube 'data-skip' 
// and do the action by it's value -10 / +25
const ranges = player.querySelectorAll('.player__slider');
// element array => it's select all 'player__slider' slider 
// and do the thing judge by it's name( voice voulmn / playing speed )

/* Build out functions */
function togglePlay() {
    // toggle play
    const method = video.paused ? 'play' : 'pause';
    // do video element's play | pause action
    video[method]();
  }
  
  function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    mainButton.textContent = icon;
  }
  
  function skip() {
   video.currentTime += parseFloat(this.dataset.skip);
  }
  
  function handleRangeUpdate() {
    video[this.name] = this.value;
  }
  
  function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
  }
  
  function scrub(e) {
    // transfer precent value to actully video time
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
  }

video.addEventListener('click', togglePlay); // click toggle
video.addEventListener('play', updateButton); // update icon
video.addEventListener('pause', updateButton); // update icon
video.addEventListener('timeupdate', handleProgress); // when video time change update progrress theme

mainButton.addEventListener('click', togglePlay); 

skipButtons.forEach(button => button.addEventListener('click', skip)); // assign each skip btn function 'skip'

// when range change by click some specific vlue or drag and drop to some value => do update video's property( speed | volumn)
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
// assign every progress can possible do action to function
progress.addEventListener('click', scrub);
// only do if mouse done( prveent the time keep move by mouse, so need mouseup to stop tracking mouse move )
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
// progress.addEventListener('mouseup', () => mousedown = false);