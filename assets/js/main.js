const STARS_VELOCITY = -0.0005;
const NUM_OF_STARS = 3000;

const stars = [];
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d', { alpha: false });
let play = true;
// big stars should have a large bright circle with a larger less bright glow that slightly pulses?
function init() {
    const viewport = document.getElementById('canvas-container');
    canvas.width = viewport.offsetWidth;
    canvas.height = viewport.offsetHeight;
    for (let i = 0; i < NUM_OF_STARS; i++) {
        const size = Math.random() / 2;
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size,
            min: Math.max(size - 0.15, 0.2),
            max: Math.min(size + 0.15, 0.5),
            change: Math.random() > 0.5 ? Math.random() / 50 : 0,
            color: `rgb(255,255,255,${Math.random()})`,
        });
    }
}

function update() {
    if (!play) return;

    for (const star of stars) {
        star.y += STARS_VELOCITY;
        if (star.y < 0) {
            star.y = star.y + 1;
        } else if (star.y > 1) {
            star.y = star.y - 1;
        }
        if (star.size <= star.min) {
            star.change *= -1;
        } else if (star.size >= star.max) {
            star.change *= -1;
        }
        star.size += star.change;
    }

    window.requestAnimationFrame(render);
}

function render() {
    const { width, height } = canvas;

    const gradient = context.createLinearGradient(width / 2, height, width / 2, 0);
    //gradient.addColorStop(0, '#ff7b6a');
    /*     gradient.addColorStop(0, '#5b1892');
    gradient.addColorStop(0.4, '#3d1892');
    gradient.addColorStop(0.5, '#540c5e'); */
    gradient.addColorStop(0.02, '#3c0a53');
    gradient.addColorStop(0.5, '#081046');
    gradient.addColorStop(1, '#04092b');
    /* gradient.addColorStop(0, '#ff91d7');
    gradient.addColorStop(1, '#bf77fa'); */

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    for (const star of stars) {
        context.fillStyle = star.color;
        context.fillRect(
            star.x * width - star.size * 2.5,
            star.y * height - star.size * 2.5,
            star.size * 5,
            star.size * 5
        );
    }
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        play = false;
    } else {
        play = true;
    }
});

function resetDimensions() {
    const viewport = document.getElementById('canvas-container');
    canvas.width = viewport.offsetWidth;
    canvas.height = viewport.offsetHeight;
}

window.onzoom = () => {
    resetDimensions();
    update();
};

(function () {
    const oldresize = window.onresize;
    window.onresize = function (e) {
        const event = window.event || e;
        if (typeof oldresize === 'function' && !oldresize.call(window, event)) {
            return false;
        }
        if (typeof window.onzoom === 'function') {
            return window.onzoom.call(window, event);
        }
    };
})();

init();
update();
setInterval(update, 50);
