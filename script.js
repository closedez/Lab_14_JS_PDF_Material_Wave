// ========== RIPPLE ЭФФЕКТ ==========
function createRipple(event) {
    const element = event.currentTarget;
    if (!element || element.classList.contains('ripple-disabled')) return;
    
    const oldRipples = element.querySelectorAll('.ripple-wave');
    oldRipples.forEach(ripple => ripple.remove());
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    let x, y;
    
    if (event.clientX && event.clientY) {
        x = event.clientX - rect.left - size / 2;
        y = event.clientY - rect.top - size / 2;
    } else {
        x = rect.width / 2 - size / 2;
        y = rect.height / 2 - size / 2;
    }
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Добавляем ripple на кликабельные элементы
document.querySelectorAll('.btn, .avatar, .upload-btn').forEach(el => {
    el.classList.add('ripple');
    el.addEventListener('click', createRipple);
});

// ========== LOCALSTORAGE - ВЕСЬ ТЕКСТ ==========
let saveTimeout;
const statusDiv = document.getElementById('saveStatus');

function showSaveStatus(message = '💾 Сохранено', isError = false) {
    statusDiv.textContent = isError ? '⚠️ ' + message : '✅ ' + message;
    statusDiv.style.opacity = '1';
    setTimeout(() => {
        statusDiv.style.opacity = '0.7';
    }, 2000);
}

// Сохраняем ВСЕ editable элементы
function saveAllToLocalStorage() {
    const allEditable = document.querySelectorAll('[contenteditable="true"]');
    const saveData = {};
    
    allEditable.forEach((el, index) => {
        let key = '';
        if (el.id) {
            key = el.id;
        } else {
            let path = [];
            let current = el;
            while (current && current !== document.body) {
                if (current.id) {
                    path.unshift('#' + current.id);
                    break;
                }
                let idx = Array.from(current.parentNode?.children || []).indexOf(current);
                path.unshift(current.tagName.toLowerCase() + (idx >= 0 ? `[${idx}]` : ''));
                current = current.parentNode;
            }
            key = path.join('>') || `editable_${index}`;
        }
        saveData[key] = el.innerHTML;
    });
    
    // Сохраняем проценты языков
    const langFills = document.querySelectorAll('.lang-fill');
    const langData = [];
    langFills.forEach(fill => {
        langData.push(fill.style.width);
    });
    saveData['_langWidths'] = JSON.stringify(langData);
    
    // Сохраняем список навыков
    const skillItems = document.querySelectorAll('.skill-item');
    const skillsText = Array.from(skillItems).map(s => s.innerHTML);
    saveData['_skillsList'] = JSON.stringify(skillsText);
    
    localStorage.setItem('resumeCompleteData', JSON.stringify(saveData));
    showSaveStatus('Все данные сохранены');
}

function debounceSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveAllToLocalStorage();
    }, 500);
}

// Загружаем ВСЕ данные
function loadAllFromLocalStorage() {
    const saved = localStorage.getItem('resumeCompleteData');
    if (!saved) return false;
    
    try {
        const data = JSON.parse(saved);
        
        // Восстанавливаем все editable элементы
        const allEditable = document.querySelectorAll('[contenteditable="true"]');
        allEditable.forEach(el => {
            let key = '';
            if (el.id) {
                key = el.id;
            } else {
                let path = [];
                let current = el;
                while (current && current !== document.body) {
                    if (current.id) {
                        path.unshift('#' + current.id);
                        break;
                    }
                    let idx = Array.from(current.parentNode?.children || []).indexOf(current);
                    path.unshift(current.tagName.toLowerCase() + (idx >= 0 ? `[${idx}]` : ''));
                    current = current.parentNode;
                }
                key = path.join('>');
            }
            
            if (data[key] && data[key] !== el.innerHTML) {
                el.innerHTML = data[key];
            }
        });
        
        // Восстанавливаем проценты языков
        if (data['_langWidths']) {
            const langWidths = JSON.parse(data['_langWidths']);
            const langFills = document.querySelectorAll('.lang-fill');
            langFills.forEach((fill, idx) => {
                if (langWidths[idx]) fill.style.width = langWidths[idx];
            });
        }
        
        // Восстанавливаем навыки
        if (data['_skillsList']) {
            const skillsText = JSON.parse(data['_skillsList']);
            const skillsContainer = document.getElementById('skillsContainer');
            if (skillsContainer && skillsText.length) {
                skillsContainer.innerHTML = skillsText.map(text => 
                    `<span class="skill-item" contenteditable="true">${text}</span>`
                ).join('');
                // Перепривязываем события к новым skill-item
                document.querySelectorAll('.skill-item').forEach(el => {
                    el.addEventListener('blur', () => {
                        el.classList.add('edit-animation');
                        setTimeout(() => el.classList.remove('edit-animation'), 300);
                        debounceSave();
                    });
                    el.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            el.blur();
                        }
                    });
                });
            }
        }
        
        showSaveStatus('Данные загружены');
        return true;
    } catch(e) {
        console.error('Ошибка загрузки:', e);
        return false;
    }
}

// Сброс всех данных
function resetAllData() {
    if (confirm('Сбросить все данные к исходным? Все изменения будут потеряны.')) {
        localStorage.removeItem('resumeCompleteData');
        location.reload();
    }
}

// ========== НАСТРОЙКА EDITABLE ЭЛЕМЕНТОВ ==========
function setupEditableElements() {
    const allEditable = document.querySelectorAll('[contenteditable="true"]');
    
    allEditable.forEach(el => {
        el.removeEventListener('blur', debounceSave);
        
        el.addEventListener('blur', () => {
            el.classList.add('edit-animation');
            setTimeout(() => el.classList.remove('edit-animation'), 300);
            debounceSave();
        });
        
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && el.tagName !== 'LI' && el.tagName !== 'P') {
                e.preventDefault();
                el.blur();
            }
        });
    });
}

// ========== ФОТОГРАФИЯ ==========
const uploadPhoto = document.getElementById('uploadPhoto');
const avatar = document.getElementById('avatar');

// Загрузка фото из localStorage
const savedPhoto = localStorage.getItem('resumePhoto');
if (savedPhoto) {
    avatar.style.backgroundImage = `url(${savedPhoto})`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundPosition = 'center';
    avatar.innerText = '';
}

uploadPhoto.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const photoUrl = event.target.result;
            avatar.style.backgroundImage = `url(${photoUrl})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.innerText = '';
            localStorage.setItem('resumePhoto', photoUrl);
            showSaveStatus('Фото сохранено');
        };
        reader.readAsDataURL(file);
    }
});

// ========== ТЕМА ==========
const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('resumeTheme');
if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeBtn.textContent = '🌙 Dark Mode';
} else {
    themeBtn.textContent = '☀️ Light Mode';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    localStorage.setItem('resumeTheme', isLight ? 'light' : 'dark');
    createRipple({ currentTarget: themeBtn, clientX: 0, clientY: 0 });
});

// ========== PDF ==========
document.getElementById('downloadBtn').addEventListener('click', () => {
    const element = document.getElementById('resume');
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'my_resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
});

// ========== СБРОС ==========
document.getElementById('resetBtn').addEventListener('click', resetAllData);
document.getElementById('resetBtn').classList.add('ripple');
document.getElementById('resetBtn').addEventListener('click', createRipple);

// ========== ИНИЦИАЛИЗАЦИЯ ==========
setupEditableElements();
loadAllFromLocalStorage();

// Наблюдатель за новыми элементами
const observer = new MutationObserver(() => {
    setupEditableElements();
    document.querySelectorAll('.btn, .avatar, .upload-btn, .reset-btn').forEach(el => {
        if (!el.classList.contains('ripple')) {
            el.classList.add('ripple');
            el.addEventListener('click', createRipple);
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// Скрываем статус через 2 секунды после загрузки
setTimeout(() => {
    statusDiv.style.opacity = '0.7';
}, 2000);