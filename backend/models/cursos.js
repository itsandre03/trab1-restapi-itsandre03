const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nomeDoCurso: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('cursos', cursoSchema);
