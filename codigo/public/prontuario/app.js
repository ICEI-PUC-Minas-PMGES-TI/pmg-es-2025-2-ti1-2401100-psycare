const appState = {
    currentPatient: 'camila',
    notes: {},
    expandedCards: new Set(['camila']),
    autoSaveTimeout: null
};

function getPatientId(patientName) {
    const name = patientName.toLowerCase();
    if (name.includes('camila')) return 'camila';
    if (name.includes('hugo')) return 'hugo';
    if (name.includes('felipe')) return 'felipe';
    return 'camila';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PSYCARE - Sistema de Prontuário Iniciado');
    initializeApp();
    setupEventListeners();
    loadSavedData();
    initializeCardsState();
});

function initializeApp() {
    initializeNotesData();
    setupEditableArea();
    updatePatientInterface();
}

function setupEventListeners() {
    console.log('🔧 Configurando eventos...');

    document.querySelectorAll('.expand-btn').forEach(button => {
        button.addEventListener('click', handleCardExpand);
    });

    document.querySelectorAll('.toolbar').forEach(toolbar => {
        toolbar.querySelectorAll('button').forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const clickedToolbar = e.currentTarget.closest('.toolbar');
                handleToolbarClick(button, index, clickedToolbar);
            });
        });
    });

    document.querySelectorAll('.editor-bar').forEach(editorBar => {
        // Botão Salvar
        editorBar.querySelector('.btn.blue').addEventListener('click', function(e) {
            const card = e.currentTarget.closest('.card');
            saveNotes(card);
        });
        
        // Botão Exportar
        editorBar.querySelector('.btn.green').addEventListener('click', function(e) {
            const card = e.currentTarget.closest('.card');
            exportNotes(card);
        });
        
        // Botão Excluir
        editorBar.querySelector('.btn.red').addEventListener('click', function(e) {
            const card = e.currentTarget.closest('.card');
            deleteNotes(card);
        });
        
        editorBar.querySelector('input').addEventListener('input', handleTitleChange);
    });

    document.querySelectorAll('.note-area').forEach(noteArea => {
        noteArea.addEventListener('input', () => {
            clearTimeout(appState.autoSaveTimeout);
            appState.autoSaveTimeout = setTimeout(autoSaveNotes, 1500);
        });
    });
}

function initializeNotesData() {
    appState.notes = {
        'camila': {
            title: 'Acompanhamento Terapêutico',
            content: `<p><strong>Informações Clínicas:</strong></p>
                     <p>Paciente relata melhora significativa nos sintomas de ansiedade após implementação das técnicas de respiração.</p>
                     <p>Medicação atual: Sertralina 50mg/dia.</p>
                     <p>Próxima consulta agendada para 26/10/2025.</p>`,
            lastEdited: new Date('2025-10-12T13:30:00'),
            created: new Date('2025-10-10T00:00:00')
        },
        'hugo': {
            title: 'Avaliação Inicial',
            content: `<p><strong>Informações Clínicas:</strong></p>
                     <p>Primeira consulta: Paciente busca tratamento para transtorno de ansiedade generalizada.</p>
                     <p>Relata dificuldades no trabalho e relacionamentos interpessoais.</p>
                     <p>Agendar retorno para avaliação do plano terapêutico.</p>`,
            lastEdited: new Date('2025-10-10T14:40:00'),
            created: new Date('2023-08-22T11:30:00')
        },
        'felipe': {
            title: 'Avaliação Inicial',
            content: `<p><strong>Informações Clínicas:</strong></p>
                     <p>Paciente em acompanhamento para depressão moderada.</p>
                     <p>Medicação: Fluoxetina 20mg/dia.</p>
                     <p>Relatou melhora do humor nas últimas semanas.</p>`,
            lastEdited: new Date('2025-10-12T14:40:00'),
            created: new Date('2024-08-10T11:30:00')
        }
    };
}

function setupEditableArea() {
    const noteArea = document.querySelector('.note-area');
    noteArea.setAttribute('contenteditable', 'true');
}

// Expansão/recolhimento dos cards
function handleCardExpand(e) {
    const button = e.currentTarget;
    const card = button.closest('.card');
    const patientName = card.querySelector('.info h2').textContent;
    const patientId = getPatientId(patientName);
    
    if (card.classList.contains('small')) {
        card.classList.remove('small');
        appState.expandedCards.add(patientId);
        button.innerHTML = '⤡';
        button.setAttribute('aria-label', 'Recolher informações do paciente');
        
        switchPatient(patientId);
        
    } else {
        card.classList.add('small');
        appState.expandedCards.delete(patientId);
        button.innerHTML = '⤢';
        button.setAttribute('aria-label', 'Expandir informações do paciente');
    }
    
    saveToLocalStorage();
}

function initializeCardsState() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const patientName = card.querySelector('.info h2').textContent;
        const patientId = getPatientId(patientName);
        const expandBtn = card.querySelector('.expand-btn');
        
        if (appState.expandedCards.has(patientId)) {
            card.classList.remove('small');
            expandBtn.innerHTML = '⤡';
            expandBtn.setAttribute('aria-label', 'Recolher informações do paciente');
        } else {
            card.classList.add('small');
            expandBtn.innerHTML = '⤢';
            expandBtn.setAttribute('aria-label', 'Expandir informações do paciente');
        }
    });
}

function handleToolbarClick(button, index) {
    const noteArea = document.querySelector('.note-area');
    noteArea.focus();
    
    const formats = [
        { action: () => document.execCommand('bold', false, null), label: 'Negrito' },
        { action: () => document.execCommand('italic', false, null), label: 'Itálico' },
        { action: () => document.execCommand('underline', false, null), label: 'Sublinhado' },
        { action: () => document.execCommand('justifyLeft', false, null), label: 'Alinhar à esquerda' },
        { action: () => document.execCommand('insertUnorderedList', false, null), label: 'Lista com marcadores' },
        { action: () => document.execCommand('insertOrderedList', false, null), label: 'Lista numerada' },
        { action: insertImage, label: 'Inserir imagem' },
        { action: attachFile, label: 'Anexar arquivo' }
    ];
    
    if (index < formats.length) {
        formats[index].action();
        showNotification(`${formats[index].label} aplicado`, 'success');
    }
}

// Inserir imagem
function insertImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.margin = '10px 0';
                img.style.borderRadius = '4px';
                
                const noteArea = document.querySelector('.note-area');
                noteArea.appendChild(img);
                noteArea.appendChild(document.createElement('br'));
                
                updateTimestamp();
                showNotification('Imagem inserida com sucesso!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Anexar arquivo
function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-attachment';
            fileElement.innerHTML = `
                <div class="file-attachment-content">
                    <span>📎</span>
                    <span>${file.name} (${formatFileSize(file.size)})</span>
                    <button class="remove-file">×</button>
                </div>
            `;
            
            const noteArea = document.querySelector('.note-area');
            noteArea.appendChild(fileElement);
            
            fileElement.querySelector('.remove-file').addEventListener('click', function() {
                noteArea.removeChild(fileElement);
                updateTimestamp();
            });
            
            updateTimestamp();
            showNotification(`Arquivo "${file.name}" anexado!`, 'success');
        }
    };
    
    input.click();
}

// Salvar anotações
function saveNotes(card = null) {
    const targetCard = card || document.querySelector('.card:not(.small)');
    const titleInput = targetCard.querySelector('.editor-bar input');
    const noteArea = targetCard.querySelector('.note-area');
    const patientName = targetCard.querySelector('.info h2').textContent;
    const patientId = getPatientId(patientName);
    
    if (patientId) {
        appState.notes[patientId] = {
            title: titleInput.value || 'Sem título',
            content: noteArea.innerHTML,
            lastEdited: new Date(),
            created: appState.notes[patientId]?.created || new Date()
        };
        
        updateTimestamp(targetCard);
        saveToLocalStorage();

        const saveBtn = targetCard.querySelector('.btn.blue');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Salvo!';
        saveBtn.style.backgroundColor = '#27AE60';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = '';
        }, 2000);
        
        showFeedback('Anotações salvas com sucesso!', 'success');
    }
}

// Salvar automaticamente
function autoSaveNotes() {
    if (appState.currentPatient) {
        const titleInput = document.querySelector('.editor-bar input');
        const noteArea = document.querySelector('.note-area');
        
        appState.notes[appState.currentPatient] = {
            ...appState.notes[appState.currentPatient],
            title: titleInput.value,
            content: noteArea.innerHTML,
            lastEdited: new Date()
        };
        
        updateTimestamp();
        saveToLocalStorage();
        showAutoSaveIndicator();
    }
}

// Exportar anotações
function exportNotes(card = null) {
    const targetCard = card || document.querySelector('.card:not(.small)');
    const patientName = targetCard.querySelector('.info h2').textContent;
    const patientId = getPatientId(patientName);
    
    if (!patientId || !appState.notes[patientId]) {
        showFeedback('Nenhuma anotação para exportar', 'error');
        return;
    }
    
    const note = appState.notes[patientId];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    const content = `PRONTUÁRIO MÉDICO - PSYCARE
============================

Paciente: ${patientName}
Título: ${note.title}
Criado em: ${formatDate(note.created)}
Última edição: ${formatDate(note.lastEdited)}

CONTEÚDO:
---------
${plainText}

---
Exportado em: ${new Date().toLocaleString('pt-BR')}
Sistema PSYCARE - Prontuário Eletrônico`.trim();
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuario_${patientName.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showFeedback('Prontuário exportado com sucesso!', 'success');
}

// Excluir anotações
function deleteNotes(card = null) {
    const targetCard = card || document.querySelector('.card:not(.small)');
    const patientName = targetCard.querySelector('.info h2').textContent;
    const patientId = getPatientId(patientName);
    
    if (confirm('Tem certeza que deseja excluir todas as anotações deste paciente? Esta ação não pode ser desfeita.')) {
        const noteArea = targetCard.querySelector('.note-area');
        const titleInput = targetCard.querySelector('.editor-bar input');
        
        noteArea.innerHTML = '<p><strong>Informações Clínicas:</strong></p>';
        titleInput.value = '';
        
        if (appState.notes[patientId]) {
            appState.notes[patientId].content = '<p><strong>Informações Clínicas:</strong></p>';
            appState.notes[patientId].title = '';
            appState.notes[patientId].lastEdited = new Date();
        }
        
        saveToLocalStorage();
        updateTimestamp(targetCard);
        showFeedback('Anotações excluídas!', 'success');
    }
}

function switchPatient(patientId) {
    appState.currentPatient = patientId;
    updatePatientInterface();
    
    console.log(`🔄 Paciente alterado para: ${patientId}`);
}

function updatePatientInterface() {
    const noteData = appState.notes[appState.currentPatient];
    const titleInput = document.querySelector('.editor-bar input');
    const noteArea = document.querySelector('.note-area');
    
    if (noteData) {
        titleInput.value = noteData.title;
        noteArea.innerHTML = noteData.content;
    }
    
    updateTimestamp();
}

function updateTimestamp() {
    const timestamp = document.querySelector('.timestamp');
    
    if (appState.currentPatient && appState.notes[appState.currentPatient]) {
        const note = appState.notes[appState.currentPatient];
        timestamp.textContent = `Criado em ${formatDate(note.created)} · Última edição em ${formatDate(note.lastEdited, true)}`;
    }
}

function handleTitleChange(e) {
    if (appState.currentPatient && appState.notes[appState.currentPatient]) {
        appState.notes[appState.currentPatient].title = e.target.value;
        appState.notes[appState.currentPatient].lastEdited = new Date();
        updateTimestamp();
    }
}

function showAutoSaveIndicator() {
    const timestamp = document.querySelector('.timestamp');
    let indicator = timestamp.querySelector('.auto-save-indicator');
    
    if (!indicator) {
        indicator = document.createElement('span');
        indicator.className = 'auto-save-indicator';
        indicator.textContent = ' • Salvamento automático';
        indicator.style.color = '#27AE60';
        indicator.style.fontSize = '11px';
        timestamp.appendChild(indicator);
    }
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 2000);
}

function formatDate(date, includeTime = false) {
    if (!(date instanceof Date) || isNaN(date)) return 'Data inválida';
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    if (includeTime === 'file') {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }
    
    if (includeTime) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year}, às ${hours}h${minutes}`;
    }
    
    return `${day}/${month}/${year}`;
}

function formatDateForFile(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        date = new Date();
    }
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('psycare_notes', JSON.stringify(appState.notes));
        localStorage.setItem('psycare_expanded_cards', JSON.stringify([...appState.expandedCards]));
        localStorage.setItem('psycare_current_patient', appState.currentPatient);
    } catch (e) {
        console.warn('Não foi possível salvar no localStorage:', e);
    }
}

function loadSavedData() {
    try {
        const savedNotes = localStorage.getItem('psycare_notes');
        const savedExpanded = localStorage.getItem('psycare_expanded_cards');
        const savedCurrentPatient = localStorage.getItem('psycare_current_patient');
        
        if (savedNotes) {
            const parsedNotes = JSON.parse(savedNotes);
            Object.keys(parsedNotes).forEach(patientId => {
                if (parsedNotes[patientId].created) {
                    parsedNotes[patientId].created = new Date(parsedNotes[patientId].created);
                }
                if (parsedNotes[patientId].lastEdited) {
                    parsedNotes[patientId].lastEdited = new Date(parsedNotes[patientId].lastEdited);
                }
            });
            appState.notes = { ...appState.notes, ...parsedNotes };
        }
        
        if (savedExpanded) {
            appState.expandedCards = new Set(JSON.parse(savedExpanded));
        }
        
        if (savedCurrentPatient) {
            appState.currentPatient = savedCurrentPatient;
        }
        
        updatePatientInterface();
        
    } catch (e) {
        console.warn('Erro ao carregar dados salvos:', e);
    }
}
