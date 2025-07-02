const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  apelido: { type: String, required: true },
  curso: { type: String, required: true },
  anoCurricular: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('alunos', alunoSchema);
