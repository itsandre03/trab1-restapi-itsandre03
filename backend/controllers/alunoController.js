const Aluno = require('../models/alunos');
const Curso = require('../models/cursos');

exports.getAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findOne({ id: req.params.id });
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAluno = async (req, res) => {
  const { id, nome, apelido, curso, anoCurricular, idade } = req.body;
  try {
    const cursoExists = await Curso.findOne({ id: curso });
    if (!cursoExists) return res.status(400).json({ message: 'Curso inválido' });

    const aluno = new Aluno({ id, nome, apelido, curso, anoCurricular, idade });
    const novoAluno = await aluno.save();
    res.status(201).json(novoAluno);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAluno = async (req, res) => {
  const { nome, apelido, curso, anoCurricular, idade } = req.body;
  try {
    const cursoExists = await Curso.findOne({ id: curso });
    if (!cursoExists) return res.status(400).json({ message: 'Curso inválido' });

    const aluno = await Aluno.findOneAndUpdate(
      { id: req.params.id },
      { nome, apelido, curso, anoCurricular, idade },
      { new: true }
    );

    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });

    res.json(aluno);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findOneAndDelete({ id: req.params.id });
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json({ message: 'Aluno apagado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};