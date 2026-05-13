/* PDF */

document
.getElementById('downloadBtn')
.addEventListener('click',()=>{

    html2pdf()
    .from(
        document.getElementById('resume')
    )
    .save();

});

/* DARK MODE */

const themeBtn =
document.getElementById('themeBtn');

themeBtn.addEventListener('click',()=>{

    document.body.classList.toggle('dark');

});

/* PHOTO */

const upload =
document.getElementById('uploadPhoto');

const avatar =
document.getElementById('avatar');

upload.addEventListener('change',(e)=>{

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(ev){

        avatar.innerHTML =
        `<img src="${ev.target.result}">`;

    }

    reader.readAsDataURL(file);

});