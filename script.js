/* Editable animation */

const editables = document.querySelectorAll('.editable');

editables.forEach(el => {

    el.addEventListener('blur', () => {

        el.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.02)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300
        });

        saveData();

    });

});

/* Ripple effect */

function rippleEffect(e) {

    const button = e.currentTarget;

    const circle = document.createElement('span');

    const diameter = Math.max(
        button.clientWidth,
        button.clientHeight
    );

    const radius = diameter / 2;

    circle.style.width = circle.style.height =
        `${diameter}px`;

    circle.style.left =
        `${e.clientX - button.offsetLeft - radius}px`;

    circle.style.top =
        `${e.clientY - button.offsetTop - radius}px`;

    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);

}

document.querySelectorAll('.download-btn, .skill')
.forEach(el => {
    el.addEventListener('click', rippleEffect);
});

/* Save data */

function saveData() {

    localStorage.setItem(
        'resumeData',
        document.getElementById('resume').innerHTML
    );

}

/* Load data */

window.addEventListener('DOMContentLoaded', () => {

    const saved = localStorage.getItem('resumeData');

    if (saved) {
        document.getElementById('resume').innerHTML = saved;
    }

});

/* PDF */

document.getElementById('downloadBtn')
.addEventListener('click', () => {

    const element = document.getElementById('resume');

    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: {
            type: 'jpeg',
            quality: 1
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save();

});