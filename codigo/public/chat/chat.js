document.addEventListener('DOMContentLoaded', function() {
    console.log('Chat carregado - DOM pronto');
    
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const charCount = document.getElementById('charCount');
    
    if (!chatMessages || !chatInput || !sendButton) {
        console.error('Elementos do chat não encontrados:', {
            chatMessages: !!chatMessages,
            chatInput: !!chatInput,
            sendButton: !!sendButton
        });
        return;
    }
    
    console.log('Todos os elementos encontrados');

    // Carregar o JSON
fetch('chat-data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.configuracoes.medico.nome);
    console.log(data.respostasAutomaticas);
  })
  .catch(error => {
    console.error('Erro ao carregar JSON:', error);
  });
    
    // hora atual
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        document.querySelectorAll('#currentTime, #startTime').forEach(element => {
            if (element) {
                element.textContent = timeString;
            }
        });
    }
    
    updateCurrentTime();
    
    // Contador de caracteres
    chatInput.addEventListener('input', function() {
        const currentLength = this.value.length;
        if (charCount) {
            charCount.textContent = `${currentLength}/500`;
        }
    });
    
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    function addMessage(text, type, sender = null) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (type === 'sent') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${escapeHtml(text)}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
        } else if (type === 'received') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="images/sarah-freitas.jpg" alt="Dra. Sarah Freitas" onerror="this.style.display='none'">
                </div>
                <div class="message-content">
                    <strong>Dra. Sarah Freitas</strong>
                    <p>${escapeHtml(text)}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
        } else if (type === 'system') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${escapeHtml(text)}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        
        // Animação
        messageDiv.style.animation = 'messageSlide 0.3s ease-out';
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Simular digitação da médica
    function showTypingIndicator() {
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received-message typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="message-avatar"><img src="images/sarah-freitas.jpg" alt="Dra. Sarah Freitas" onerror="this.style.display=\'none\'"></div><div class="message-content"><strong>Dra. Sarah Freitas</strong><p>Digitando...</p></div>';
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    // Remover indicador de digitação
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Simular resposta automática
    function simulateDoctorResponse(userMessage) {
        showTypingIndicator();
        
        const typingTime = Math.random() * 2000 + 1000;
        
        setTimeout(function() {
            hideTypingIndicator();
            
            let response;
            const lowerMessage = userMessage.toLowerCase();
            
            // Respostas baseadas no conteúdo da mensagem
            if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
                response = "Olá! É um prazer conversar com você. Como você está se sentindo hoje?";
            } else if (lowerMessage.includes('ansiedade') || lowerMessage.includes('ansioso')) {
                response = "Entendo que a ansiedade pode ser desafiadora. Podemos trabalhar juntos em técnicas para gerenciar esses sentimentos.";
            } else if (lowerMessage.includes('depressão') || lowerMessage.includes('deprimido')) {
                response = "A depressão é uma condição séria, mas tratável. É muito corajoso da sua parte buscar ajuda.";
            } else if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
                response = "De nada! Estou aqui para ajudar. Se tiver mais alguma dúvida, fique à vontade.";
            } else if (lowerMessage.includes('horário') || lowerMessage.includes('consulta')) {
                response = "Posso ajudá-lo a agendar uma consulta. Temos disponibilidade nos próximos dias.";
            } else if (lowerMessage.includes('remédio') || lowerMessage.includes('medicação')) {
                response = "Sobre medicações, é importante conversarmos detalhadamente em consulta.";
            } else {
                // Respostas genéricas
                const genericResponses = [
                    "Entendo. Pode me contar um pouco mais sobre isso?",
                    "Obrigada por compartilhar. Como isso tem afetado seu dia a dia?",
                    "Compreendo sua preocupação. Vamos trabalhar juntos nisso.",
                    "Pode explicar um pouco melhor o que você está sentindo?",
                    "Estou aqui para ouvir e ajudar. Continue compartilhando."
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
            
            addMessage(response, 'received');
        }, typingTime);
    }

    function sendMessage() {
        console.log('Função sendMessage chamada');
        
        const message = chatInput.value.trim();
        console.log('Mensagem:', message);
        
        if (message === '') {
            chatInput.focus();
            return;
        }
        
        addMessage(message, 'sent');
        
        chatInput.value = '';
        if (charCount) {
            charCount.textContent = '0/500';
            charCount.style.color = '#666';
        }
        
        simulateDoctorResponse(message);
        
        chatInput.focus();
    }
    
    // Event Listeners
    sendButton.addEventListener('click', function(e) {
        console.log('Botão enviar clicado');
        e.preventDefault();
        sendMessage();
    });
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Enter pressionado');
            e.preventDefault();
            sendMessage();
        }
    });
    
    document.querySelectorAll('.chat-tools button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tool = this.getAttribute('aria-label');
            addMessage(`[${tool} - Funcionalidade em desenvolvimento]`, 'system');
        });
    });
    
    setTimeout(() => {
        chatInput.focus();
    }, 1000);
    
    console.log('Chat inicializado com sucesso');
});