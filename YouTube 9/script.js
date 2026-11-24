const MODE = "web";
const $ = (id) => document.getElementById(id),
    card = $("card"),
    tag = $("tag"),
    wire = $("wire"),
    flash = $("flash"),
    rib = $("ribbon"),
    body = document.body;
const word = (el, t, off) => {
    $(el).innerHTML = [...t]
        .map(
            (c, i) =>
                `<span class="ltr" style="--i:${i + off};--r:${[-5, 4, -3, 6, -4, 3, -6, 4][(i + off) % 8]}deg;--dy:${[0, -0.8, 0.6, -0.4][(i + off) % 4]}cqw">${c}</span>`,
        )
        .join("");
};
word("lt1", "AMUL", 0);
word("lt2", "MILK", 4);
/* [x%, y%, width cqw, rotate deg, scale] */
const S = {
    1: {
        bottle: [50, 48.9, 14.2, 0, 1],
        splash: [48.8, 64.9, 62, 0, 1],
        splashF: [48.8, 64.9, 62, 0, 1],
        pour: [57, 23.1, 11.3, 0, 1],
    },
    2: {
        bottle: [68, 49, 17, -16, 1],
        splash: [66.6, 68.1, 70, 0, 1],
        splashF: [66.6, 68.1, 70, 0, 1],
        pour: [57, 23.1, 11.3, 0, 1],
    },
    3: {
        bottle: [68, 50, 16, 8, 1],
        splash: [66.6, 66.8, 64, 0, 1],
        splashF: [66.6, 66.8, 64, 0, 1],
        pour: [57, 23.1, 11.3, 0, 1],
    },
};
function setState(s) {
    card.dataset.s = s;
    for (const n of Object.keys(S[1])) {
        const e = $(n),
            v = S[Math.max(s, 1)][n];
        let y = v[1],
            sc = v[4];
        if (s === 0) {
            if (n === "bottle") y = v[1] + 75;
            if (n.startsWith("splash")) sc = 0.2;
        }
        e.style.left = v[0] + "%";
        e.style.top = y + "%";
        e.style.width = v[2] + "cqw";
        e.style.transform = `translate(-50%,-50%) rotate(${v[3]}deg) scale(${sc})`;
        e.style.opacity = s > 0 && (n !== "pour" || s === 1) ? 1 : 0;
        e.style.transitionTimingFunction =
            s === 1 ? "cubic-bezier(.3,1.55,.5,1)" : "cubic-bezier(.7,0,.2,1)";
    }
}
setState(0);
function burst() {
    for (let i = 0; i < 26; i++) {
        const d = document.createElement("i"),
            s = 0.5 + Math.random() * 1.1,
            dx = (Math.random() - 0.5) * 46,
            h = 10 + Math.random() * 16;
        d.style.cssText = `position:absolute;z-index:5;left:48.8%;top:56%;width:${s}cqw;height:${s}cqw;border-radius:50%;background:#fff;box-shadow:0 .2cqw .5cqw rgba(8,32,150,.35)`;
        card.appendChild(d);
        d.animate(
            [
                { transform: "translate(0,0)", opacity: 1 },
                {
                    transform: `translate(${dx * 0.6}cqw,${-h}cqw)`,
                    opacity: 1,
                    offset: 0.45,
                    easing: "ease-in",
                },
                {
                    transform: `translate(${dx}cqw,${6 + Math.random() * 8}cqw)`,
                    opacity: 0,
                },
            ],
            {
                duration: 1100 + Math.random() * 700,
                delay: Math.random() * 250,
                easing: "ease-out",
                fill: "forwards",
            },
        ).onfinish = () => d.remove();
    }
}
let T = [],
    cur = 1,
    iv;
const at = (ms, f) => T.push(setTimeout(f, ms));
const sweep = (ms, s) => {
    at(ms, () => {
        rib.classList.remove("run");
        void rib.getBoundingClientRect();
        rib.classList.add("run");
    });
    at(ms + 750, () => setState(s));
};
function reel() {
    T.forEach(clearTimeout);
    T = [];
    rib.classList.remove("run");
    body.classList.remove("blue");
    card.className = "card";
    setState(0);
    wire.style.opacity = 1;
    tag.style.opacity = 1;
    tag.textContent = "Before";
    flash.style.opacity = 0;
    at(1000, () => {
        card.classList.add("gl");
        flash.style.opacity = 1;
    });
    at(1250, () => {
        body.classList.add("blue");
        wire.style.opacity = 0;
        card.classList.add("bl");
        tag.textContent = "After";
        tag.classList.remove("pop");
        void tag.offsetWidth;
        tag.classList.add("pop");
    });
    at(1400, () => {
        flash.style.opacity = 0;
        card.classList.remove("gl");
        card.classList.add("ld");
    });
    at(2900, () => {
        card.classList.remove("ld");
        setState(1);
    });
    at(3700, burst);
    at(3400, () => (tag.style.opacity = 0));
    sweep(7400, 2);
    sweep(10800, 3);
}
function next() {
    cur = (cur % 3) + 1;
    rib.classList.remove("run");
    void rib.getBoundingClientRect();
    rib.classList.add("run");
    setTimeout(() => {
        setState(cur);
        if (cur === 1) setTimeout(burst, 800);
    }, 750);
}
function web() {
    card.classList.add("bl");
    clearInterval(iv);
    cur = 1;
    setState(0);
    setTimeout(() => {
        setState(1);
        setTimeout(burst, 800);
        iv = setInterval(next, 5200);
    }, 300);
}
if (MODE === "reel") {
    addEventListener("click", reel);
    addEventListener("keydown", (e) => {
        if (e.key === "r" || e.key === " ") reel();
    });
    document.fonts.ready.then(() => setTimeout(reel, 500));
} else {
    addEventListener("click", () => {
        clearInterval(iv);
        next();
        iv = setInterval(next, 5200);
    });
    document.fonts.ready.then(web);
}