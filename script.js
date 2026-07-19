const no = document.getElementById("no");


no.addEventListener(
"mouseover",
function(){


let x =
Math.random()*250;


let y =
Math.random()*200;



no.style.position="absolute";


no.style.left=x+"px";

no.style.top=y+"px";


}

);



const yes =
document.getElementById("yes");


yes.onclick=function(){

document.getElementById("page1")
.classList.add("hidden");


document.getElementById("page2")
.classList.remove("hidden");


}




document.getElementById("next")
.onclick=function(){


document.getElementById("page2")
.classList.add("hidden");


document.getElementById("page3")
.classList.remove("hidden");


}
