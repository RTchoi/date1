const no = document.getElementById("no");


let noX;
let noY;



window.onload=function(){

let rect =
no.getBoundingClientRect();


noX = rect.left;

noY = rect.top;


}




no.addEventListener(
"mouseover",
function(){


let moveDistance = 150;


let randomX =
(Math.random()-0.5)
* moveDistance;


let randomY =
(Math.random()-0.5)
* moveDistance;



noX += randomX;

noY += randomY;



// 화면 밖 방지

if(noX < 20)
noX = 20;


if(noY < 20)
noY = 20;



if(noX > window.innerWidth-100)
noX = window.innerWidth-100;


if(noY > window.innerHeight-100)
noY = window.innerHeight-100;



no.style.left =
noX+"px";


no.style.top =
noY+"px";



});
