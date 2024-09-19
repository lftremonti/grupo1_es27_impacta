const fs = require('fs');
const path = require('path');

// Função para ler o arquivo HTML e substituir o @TOKEN@
const getHtmlTemplate = (code) => {
    // Lê o arquivo HTML
    const templatePath = path.join(__dirname, '../template/template.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    
    // Substitui o @TOKEN@ pelo código
    htmlTemplate = htmlTemplate.replace('@TOKEN@', code);
    
    return htmlTemplate;
};


module.exports = { getHtmlTemplate };