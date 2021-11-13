
// Hamburger button, mobile, and tablet
const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul'); 
const header = document.querySelector('.header.container');

hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    mobile_menu.classList.toggle('active');
})

//header animation
document.addEventListener('scroll', ()=>{
    var scroll_position = window.scrollY;
    if(scroll_position >250){
        header.style.backgroundColor = "#1f2833"
    }
    else{
        header.style.backgroundColor = "transparent"
    }
})

//paralax
let bg = document.getElementById("bg");
let moon = document.getElementById("moon");
let mouuntain = document.getElementById("mountain");
let road = document.getElementById("road");

window.addEventListener('scroll', function(){
    var value = window.scrollY;

    bg.style.top = value * 0.5 + 'px';
    moon.style.left = -value * 0.5 + 'px';
    mountain.style.top = -value * 0.15 + 'px';
    road.style.top = value * 0.15 + 'px';
})

