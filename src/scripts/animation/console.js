const toggle = document.getElementById('animation-console-toggle');
const animationConsole = document.getElementById('animation-console');
const consoleContent = document.getElementById('ac-content');
const consoleResizer = document.getElementById('ac-resizer');

let x, w;

function setupAnimationConsole() {
    toggle.addEventListener('click', () => {
        animationConsole.classList.toggle('-active');
        toggle.classList.toggle('-active');
    });

    consoleResizer.addEventListener('mousedown', handleMouseDown);
}

function handleMouseDown(event) {
    x = event.clientX;
    w = parseInt(window.getComputedStyle(animationConsole).width, 10);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
    const completeWidth = w - (event.clientX - x);

    if (700 > completeWidth && completeWidth > 300) {
        animationConsole.style.width = `${completeWidth}px`;
    }
}

function handleMouseUp() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function hideAnimationConsole() {
    animationConsole.classList.remove('-active');
    consoleContent.replaceChildren();
    toggle.classList.remove('-active');
    toggle.style.display = 'none';
}

function showAnimationConsole() {
    toggle.style.display = 'block';
}

export {
    setupAnimationConsole,
    hideAnimationConsole,
    showAnimationConsole
}