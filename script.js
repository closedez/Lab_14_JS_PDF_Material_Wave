// Анимация при изменении текста
const editables = document.querySelectorAll('.editable');

editables.forEach(el => {
    el.addEventListener('blur', () => {
        el.classList.add('edit-animation');
        setTimeout(() => el.classList.remove('edit-animation'), 300);
        saveData();
    });
});

// Material Wave (ripple)
function addRipple(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    const size = Math.max(rect.width, rect.height);
    wave.style.width = wave.style.height = size + 'px';
    wave.style.left = (e.clientX - rect.left - size/2) + 'px';
    wave.style.top = (e.clientY - rect.top - size/2) + 'px';
    el.style.position = 'relative';
    el.appendChild(wave);
    setTimeout(() => wave.remove(), 500);
}

editables.forEach(el => {
    el.classList.add('ripple');
    el.addEventListener('click', addRipple);
});

document.getElementById('downloadBtn').classList.add('ripple');
document.getElementById('downloadBtn').addEventListener('click', addRipple);

// Скачивание PDF
document.getElementById('downloadBtn').addEventListener('click', () => {
    const element = document.getElementById('resume');
    html2pdf().set({
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
});

// Сохранение в localStorage
function saveData() {
    const data = {};
    editables.forEach((el, i) => {
        if (el.id) {
            data[el.id] = el.innerText;
        } else {
            data[i] = el.innerText;
        }
    });
    localStorage.setItem('resumeData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('resumeData');
    if (!saved) return;
    const data = JSON.parse(saved);
    editables.forEach((el, i) => {
        if (el.id && data[el.id]) {
            el.innerText = data[el.id];
        } else if (data[i]) {
            el.innerText = data[i];
        }
    });
}

loadData();