document
.getElementById('downloadBtn')
.addEventListener('click', () => {

    const element =
        document.getElementById('resume');

    html2pdf()
        .set({
            margin:0,
            filename:'resume.pdf',

            image:{
                type:'jpeg',
                quality:1
            },

            html2canvas:{
                scale:2
            },

            jsPDF:{
                unit:'mm',
                format:'a4',
                orientation:'portrait'
            }
        })
        .from(element)
        .save();

});