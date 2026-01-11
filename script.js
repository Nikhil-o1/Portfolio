
function revealTospan(){
    document.querySelectorAll(".reveal")
    .forEach(function(elem){
    let parent = document.createElement("span");
    let child = document.createElement("span");

    parent.classList.add("parent");
    child.classList.add("child");

    child.textContent = elem.textContent;
    parent.appendChild(child);
    
    elem.innerHTML = "";
    elem.appendChild(parent);
    });
}

revealTospan();


var t1 = gsap.timeline();
t1
.from(".child .span", {
    x:100,
    stagger:0.2,
    duration:1.4,
    ease: "circ.easeInOut",
});

t1
.to("parent .child", {
    y:"-100%",
    duration:1,
    ease: "circ.easeInOut",
});
t1
.to("loader", {
    height:0,
    duration:1,
    ease: "circ.easeInOut",
});
t1
.to("green", {
    height:"100%",
    top:0,
    duration:1,
    ease: "circ.easeInOut",
});
t1
.to("green", {
    height:"0%",
    top:0,
    duration:1,
    ease: "circ.easeInOut",
});