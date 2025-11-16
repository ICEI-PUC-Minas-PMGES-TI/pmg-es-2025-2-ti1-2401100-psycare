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