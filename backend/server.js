require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI disponível em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado!');
	console.log('------------------');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor: http://localhost:${PORT}`);
	  console.log(`Alunos: http://localhost:${PORT}/alunos`);
	  console.log(`Cursos: http://localhost:${PORT}/cursos`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
	  console.log('------------------');
    });
  })
  .catch(err => {
    console.error('Erro ao conectar MongoDB:', err);
  });
