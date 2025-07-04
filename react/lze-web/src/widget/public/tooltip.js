const tooltip = document.createElement("div");
tooltip.classList.add("tooltip"), document.body.appendChild(tooltip), document.addEventListener("mousemove", t => {
    const e = tooltip.offsetWidth,
        i = tooltip.offsetHeight,
        o = t.clientX,
        l = t.clientY;
    let s = o + 20,
        n = l - 30;
    window.innerWidth - o < 150 && (s = o - e - 20), l < 60 && (n = l + i - 20), tooltip.style.left = `${s}px`, tooltip.style.top = `${n}px`;
    const p = t.target.closest("[title], [tip-title]");
    if (p) {
        if (p.hasAttribute("title") && !p.hasAttribute("tip-title")) {
            const t = p.getAttribute("title");
            p.setAttribute("tip-title", t), p.removeAttribute("title"), tooltip.innerText = t
        } else p.hasAttribute("tip-title") && (tooltip.innerText = p.getAttribute("tip-title"));
        tooltip.style.opacity = "1"
    }
}), document.addEventListener("mouseout", t => {
    const e = t.target.closest("[title], [tip-title]");
    e && (tooltip.innerText = "", tooltip.style.opacity = "0")
});