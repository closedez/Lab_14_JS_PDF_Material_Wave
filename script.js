/* =========================
   Editable animation
========================= */

const editables = document.querySelectorAll('.editable');

editables.forEach(el => {

    el.addEventListener('blur', () => {

        el.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.02)' },
            { transform: 'scale(1)' }
        ], {
            duration: 250
        });

        saveData();

    });

});

/* =========================
   Save data
========================= */

function saveData() {

    const resumeHTML =
        document.getElementById('resume').innerHTML;

    localStorage.setItem(
        'resumeHTML',
        resumeHTML
    );

}

/* =========================
   Load data
========================= */

window.addEventListener('DOMContentLoaded', () => {

    const savedHTML =
        localStorage.getItem('resumeHTML');

    if (savedHTML) {

        document.getElementById('resume').innerHTML =
            savedHTML;

    }

});

/* =========================
   PDF download
========================= */

document
.getElementById('downloadBtn')
.addEventListener('click', () => {

    const element =
        document.getElementById('resume');

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