
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



gsap.to(".parent .child", {
    y:"-100%",
    duration:2,
    delay:2,
    ease: "expo.easeInOut",
});