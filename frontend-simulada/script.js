const API_URL = 'http://localhost:3000';

const tbodyAlunos = document.getElementById('listaAlunos');
const alunoForm = document.getElementById('alunoForm');
const cancelarAlunoBtn = document.getElementById('cancelarAluno');

const inputId = document.getElementById('alunoId');
const inputNome = document.getElementById('nome');
const inputApelido = document.getElementById('apelido');
const selectCurso = document.getElementById('curso');
const inputAno = document.getElementById('anoCurricular');

const cursoForm = document.getElementById('cursoForm');
const cursoId = document.getElementById('cursoId');
const nomeDoCurso = document.getElementById('nomeDoCurso');
const cancelarCursoBtn = document.getElementById('cancelarCurso');
const listaCursos = document.getElementById('listaCursos');

let cursos = [];

async function fetchCursos() {
    const res = await fetch(`${API_URL}/cursos`);
    cursos = await res.json();

    selectCurso.innerHTML = '<option value="">-- Selecione o curso --</option>';
    cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.nomeDoCurso;
        selectCurso.appendChild(option);
    });
}

async function fetchAlunos() {
    const res = await fetch(`${API_URL}/alunos`);
    const alunos = await res.json();

    tbodyAlunos.innerHTML = '';

    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.apelido}</td>
            <td>${getNomeCurso(aluno.curso)}</td>
            <td>${aluno.anoCurricular}</td>
            <td>
                <button class="btn-secondary btn-editar" data-id="${aluno.id}">Editar</button>
                <button class="btn-secondary btn-apagar" data-id="${aluno.id}">Apagar</button>
            </td>
        `;
        tbodyAlunos.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) editarAluno(id);
        });
    });

    document.querySelectorAll('.btn-apagar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) apagarAluno(id);
        });
    });
}

// ----- ALUNOS -----

function getNomeCurso(cursoId) {
    const curso = cursos.find(c => c.id === cursoId);
    return curso ? curso.nomeDoCurso : '';
}

async function adicionarAluno(aluno) {
    const res = await fetch(`${API_URL}/alunos`);
    const data = await res.json();
    const ids = data.map(a => a.id).filter(id => id !== undefined && id !== null);
    const numericIds = ids.map(id => Number(id)).filter(n => !isNaN(n));
    const nextId = numericIds.length ? String(Math.max(...numericIds) + 1) : '1';

    aluno.id = nextId;

    await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
    });
}

async function atualizarAluno(id, aluno) {
    await fetch(`${API_URL}/alunos/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(aluno)
    });
}

async function apagarAluno(id) {
    if (confirm('Tem certeza que deseja apagar este aluno?')) {
        await fetch(`${API_URL}/alunos/${id}`, { method: 'DELETE' });
        await fetchAlunos();
    }
}

async function editarAluno(id) {
    const res = await fetch(`${API_URL}/alunos/${id}`);
    const aluno = await res.json();
    preencherFormulario(aluno);

    const msg = document.getElementById('msgEditarAluno');
    if (msg) msg.remove();

    alunoForm.insertAdjacentHTML(
        'afterbegin',
        `<p id="msgEditarAluno" style="
            color: #3498db; 
            font-weight: bold; 
            font-size: 1.1em; 
            margin-bottom: 1rem; 
            padding: 0.5rem; 
            border-left: 4px solid #3498db;
            background-color: #eaf6ff;
            border-radius: 4px;
        ">
            A editar o Aluno ID ${aluno.id}
        </p>`
    );
}

function preencherFormulario(aluno) {
    inputId.value = aluno.id;
    inputNome.value = aluno.nome;
    inputApelido.value = aluno.apelido;
    selectCurso.value = aluno.curso;
    inputAno.value = aluno.anoCurricular;
    cancelarAlunoBtn.style.display = 'inline-block';
}

function limparAlunoForm() {
    const msg = document.getElementById('msgEditarAluno');
    if (msg) msg.remove();

    inputId.value = '';
    alunoForm.reset();
    cancelarAlunoBtn.style.display = 'none';
}

alunoForm.addEventListener('submit', async e => {
    e.preventDefault();

    const aluno = {
        nome: inputNome.value.trim(),
        apelido: inputApelido.value.trim(),
        curso: selectCurso.value,
        anoCurricular: inputAno.value
    };

    if (!aluno.nome || !aluno.apelido || !aluno.curso || !aluno.anoCurricular) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const id = inputId.value;

    if (id) await atualizarAluno(id, aluno);
    else await adicionarAluno(aluno);

    limparAlunoForm();
    await fetchAlunos();
});

cancelarAlunoBtn.addEventListener('click', e => {
    e.preventDefault();
    limparAlunoForm();
});


// ----- CURSOS -----

async function fetchListaCursos() {
    const res = await fetch(`${API_URL}/cursos`);
    const data = await res.json();
    listaCursos.innerHTML = '';

    data.forEach(curso => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nomeDoCurso}</td>
            <td>
                <button class="btn-editar-curso btn-secondary" data-id="${curso.id}">Editar</button>
                <button class="btn-apagar-curso btn-secondary" data-id="${curso.id}">Apagar</button>
            </td>
        `;
        listaCursos.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar-curso').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) editarCurso(id);
        })
    );

    document.querySelectorAll('.btn-apagar-curso').forEach(btn =>
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) apagarCurso(id);
        })
    );
}

async function adicionarCurso(curso) {
    const res = await fetch(`${API_URL}/cursos`);
    const data = await res.json();
    const ids = data.map(c => c.id).filter(id => id !== undefined && id !== null);
    const numericIds = ids.map(id => Number(id)).filter(n => !isNaN(n));
    const nextId = numericIds.length ? String(Math.max(...numericIds) + 1) : '1';

    curso.id = nextId;

    await fetch(`${API_URL}/cursos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso)
    });
}

async function atualizarCurso(id, curso) {
    await fetch(`${API_URL}/cursos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curso)
    });
}

async function apagarCurso(id) {
    if (confirm('Tem certeza que deseja apagar este curso?')) {
        await fetch(`${API_URL}/cursos/${id}`, { method: 'DELETE' });
        await fetchListaCursos();
        await fetchCursos();
    }
}

async function editarCurso(id) {
    const res = await fetch(`${API_URL}/cursos/${id}`);
    const curso = await res.json();
    cursoId.value = curso.id;
    nomeDoCurso.value = curso.nomeDoCurso;
    cancelarCursoBtn.style.display = 'inline-block';

    const msg = document.getElementById('msgEditarCurso');
    if (msg) msg.remove();

    cursoForm.insertAdjacentHTML(
        'afterbegin',
        `<p id="msgEditarCurso" style="
            color: #3498db; 
            font-weight: bold; 
            font-size: 1.1em; 
            margin-bottom: 1rem; 
            padding: 0.5rem; 
            border-left: 4px solid #3498db;
            background-color: #eaf6ff;
            border-radius: 4px;
        ">
            A editar o curso ID ${curso.id}
        </p>`
    );
}

cursoForm.addEventListener('submit', async e => {
    e.preventDefault();

    const curso = { nomeDoCurso: nomeDoCurso.value.trim() };
    if (!curso.nomeDoCurso) {
        alert('O nome do curso é obrigatório.');
        return;
    }

    const id = cursoId.value;

    if (id) await atualizarCurso(id, curso);
    else await adicionarCurso(curso);

    limparCursoForm();
    await fetchListaCursos();
    await fetchCursos();
});

cancelarCursoBtn.addEventListener('click', e => {
    e.preventDefault();
    limparCursoForm();
});

function limparCursoForm() {
    const msg = document.getElementById('msgEditarCurso');
    if (msg) msg.remove();

    cursoForm.reset();
    cursoId.value = '';
    cancelarCursoBtn.style.display = 'none';
}

// Inicialização
(async () => {
    await fetchCursos();
    await fetchAlunos();
    await fetchListaCursos();
    cancelarAlunoBtn.style.display = 'none';
    cancelarCursoBtn.style.display = 'none';
})();