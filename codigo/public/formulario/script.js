// Elementos da interface
const navHome = document.getElementById('nav-home');
const navRegister = document.getElementById('nav-register');
const navPatients = document.getElementById('nav-patients');
const startBtn = document.getElementById('start-btn');

const homeSection = document.getElementById('home-section');
const registerSection = document.getElementById('register-section');
const patientsSection = document.getElementById('patients-section');

const patientForm = document.getElementById('patient-form');
const patientsList = document.getElementById('patients-list');
const searchPatient = document.getElementById('search-patient');

// URL da API JSON Server
const API_URL = 'http://localhost:3000/patients';

// Navegação entre seções
function showSection(section) {
    homeSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    patientsSection.classList.add('hidden');
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    section.classList.remove('hidden');
    
    if (section === homeSection) navHome.classList.add('active');
    if (section === registerSection) navRegister.classList.add('active');
    if (section === patientsSection) {
        navPatients.classList.add('active');
        loadPatients();
    }
}

// Event listeners de navegação
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(homeSection);
});

navRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(registerSection);
});

navPatients.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(patientsSection);
});

startBtn.addEventListener('click', () => {
    showSection(registerSection);
});

// Calcular pontuação da triagem
function calculateScore() {
    const q1 = parseInt(document.getElementById('q1').value) || 0;
    const q2 = parseInt(document.getElementById('q2').value) || 0;
    const q3 = parseInt(document.getElementById('q3').value) || 0;
    return q1 + q2 + q3;
}

// Determinar prioridade
function getPriority(score) {
    if (score <= 5) return { level: 'Baixa', class: 'priority-low' };
    if (score <= 10) return { level: 'Média', class: 'priority-medium' };
    return { level: 'Alta', class: 'priority-high' };
}

// Calcular idade
function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Cadastrar paciente
patientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const score = calculateScore();
    const priority = getPriority(score);
    
    const patientData = {
        name: document.getElementById('name').value,
        birthdate: document.getElementById('birthdate').value,
        phone: document.getElementById('phone').value,
        score: score,
        priority: priority.level,
        registrationDate: new Date().toISOString().split('T')[0]
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData)
        });
        
        if (response.ok) {
            patientForm.reset();
            showAlert('Paciente cadastrado com sucesso!', 'success');
            setTimeout(() => showSection(patientsSection), 1500);
        } else {
            throw new Error('Erro ao cadastrar');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao cadastrar paciente. Verifique se o JSON Server está rodando.', 'error');
    }
});

// Carregar pacientes
async function loadPatients() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro na requisição');
        
        const patients = await response.json();
        
        patientsList.innerHTML = '';
        
        if (patients.length === 0) {
            patientsList.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum paciente cadastrado</td></tr>';
            return;
        }
        
        patients.forEach(patient => {
            const age = calculateAge(patient.birthdate);
            const priority = getPriority(patient.score);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${age} anos</td>
                <td>${patient.score}</td>
                <td class="${priority.class}">${patient.priority}</td>
                <td>
                    <button class="btn" onclick="editPatient(${patient.id})">Editar</button>
                    <button class="btn delete-btn" onclick="deletePatient(${patient.id})">Excluir</button>
                </td>
            `;
            
            patientsList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro:', error);
        patientsList.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Erro ao carregar pacientes. Verifique o JSON Server.</td></tr>';
    }
}

// Buscar pacientes
searchPatient.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    try {
        const response = await fetch(API_URL);
        const patients = await response.json();
        
        const filteredPatients = patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm)
        );
        
        patientsList.innerHTML = '';
        
        if (filteredPatients.length === 0) {
            patientsList.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum paciente encontrado</td></tr>';
            return;
        }
        
        filteredPatients.forEach(patient => {
            const age = calculateAge(patient.birthdate);
            const priority = getPriority(patient.score);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.name}</td>
                <td>${age} anos</td>
                <td>${patient.score}</td>
                <td class="${priority.class}">${patient.priority}</td>
                <td>
                    <button class="btn" onclick="editPatient(${patient.id})">Editar</button>
                    <button class="btn delete-btn" onclick="deletePatient(${patient.id})">Excluir</button>
                </td>
            `;
            
            patientsList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
    }
});

// Funções globais para os botões
window.editPatient = (id) => {
    alert(`Editar paciente ID: ${id}\nFuncionalidade em desenvolvimento.`);
};

window.deletePatient = async (id) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                showAlert('Paciente excluído com sucesso!', 'success');
                loadPatients();
            } else {
                throw new Error('Erro ao excluir');
            }
        } catch (error) {
            showAlert('Erro ao excluir paciente', 'error');
        }
    }
};

// Mostrar alertas
function showAlert(message, type) {
    // Remove alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => alert.remove(), 3000);
}

// Adicionar estilos para alertas e botão de excluir
const style = document.createElement('style');
style.textContent = `
    .delete-btn {
        background-color: var(--danger) !important;
    }
    .delete-btn:hover {
        background-color: #d32f2f !important;
    }
    .alert {
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    .alert-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .alert-error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    showSection(homeSection);
});