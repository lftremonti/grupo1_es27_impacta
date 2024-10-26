/**
 * Verifica se os campos obrigatórios estão presentes e não vazios
 * @param {Object} obj - Objeto contendo os dados a serem validados
 * @param {Array} camposObrigatorios - Array de strings com os nomes dos campos obrigatórios
 * @returns {string|null} - Retorna uma mensagem de erro se algum campo estiver vazio, caso contrário null
 */
const validarCamposObrigatorios = (obj, camposObrigatorios) => {
    const camposFaltantes = camposObrigatorios.filter(campo => !obj[campo] || obj[campo].toString().trim() === '');

    return camposFaltantes.length > 0
        ? `Os campos ${camposFaltantes.join(', ')} são obrigatórios!`
        : null;
};

module.exports = { validarCamposObrigatorios };