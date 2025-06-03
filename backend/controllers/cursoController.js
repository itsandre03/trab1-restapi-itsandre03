const Curso = require('../models/cursos');

exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCursoById = async (req, res) => {
  try {
    const curso = await Curso.findOne({ id: req.params.id });
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json(curso);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCurso = async (req, res) => {
  const curso = new Curso({ id: req.body.id, nomeDoCurso: req.body.nomeDoCurso });
  try {
    const novoCurso = await curso.save();
    res.status(201).json(novoCurso);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCurso = async (req, res) => {
  try {
    const curso = await Curso.findOneAndUpdate(
      { id: req.params.id },
      { nomeDoCurso: req.body.nomeDoCurso },
      { new: true }
    );
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json(curso);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findOneAndDelete({ id: req.params.id });
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json({ message: 'Curso apagado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
