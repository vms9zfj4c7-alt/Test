// Gestion de l'interface utilisateur (Notifications, Modales, Effets)

// Système de notifications (Toast)
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();

    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    notification.innerHTML = message;

    container.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 10);

    // Disparition automatique
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Notification persistante avec barre de progression (ou texte)
function showProgressNotification(id, message) {
    let container = document.getElementById('notification-container') || createNotificationContainer();

    // Vérifier si elle existe déjà
    let existing = document.getElementById(`notif-${id}`);
    if (existing) {
        // Mettre à jour le message
        const textEl = existing.querySelector('.notif-text');
        if (textEl) textEl.innerHTML = message;
        return;
    }

    const notification = document.createElement('div');
    notification.id = `notif-${id}`;
    notification.className = 'toast-notification info progress-notif';
    notification.innerHTML = `
        <span class="notif-text">${message}</span>
        <button class="close-notif" onclick="closeNotification('${id}')">×</button>
    `;

    container.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
}

function closeNotification(id) {
    const notification = document.getElementById(`notif-${id}`);
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
    return container;
}

// Système de texte flottant (pour les gains)
function showFloatingText(x, y, text, color = '#fff') {
    const floating = document.createElement('div');
    floating.className = 'floating-text';
    floating.textContent = text;
    floating.style.left = `${x}px`;
    floating.style.top = `${y}px`;
    floating.style.color = color;

    document.body.appendChild(floating);

    setTimeout(() => floating.remove(), 1000);
}

// Système de Modale personnalisée
function showConfirmModal(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';

    modal.innerHTML = `
        <div class="custom-modal">
            <div class="modal-content">
                <h3>Confirmation</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button id="modal-cancel">Annuler</button>
                    <button id="modal-confirm" class="confirm-btn">Confirmer</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animation
    setTimeout(() => modal.classList.add('active'), 10);

    // Event listeners
    document.getElementById('modal-cancel').onclick = () => {
        closeModal(modal);
        if (onCancel) onCancel();
    };

    document.getElementById('modal-confirm').onclick = () => {
        closeModal(modal);
        if (onConfirm) onConfirm();
    };
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// Fonction utilitaire pour formater les nombres
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Menu de Triche (Caché)
function openCheatMenu() {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';

    modal.innerHTML = `
        <div class="custom-modal">
            <h3 style="color: #ff00ff; text-shadow: 0 0 10px #ff00ff;">🤫 GOD MODE 🤫</h3>
            <div class="cheat-inputs">
                <div>
                    <label>Argent (€)</label>
                    <input type="number" id="cheat-money" value="${Math.floor(player.money)}">
                </div>
                <div>
                    <label>Fans</label>
                    <input type="number" id="cheat-fans" value="${Math.floor(player.fans)}">
                </div>
                <div>
                    <label>Santé (%)</label>
                    <input type="number" id="cheat-health" value="${Math.floor(player.health)}" max="100">
                </div>
                <div>
                    <label>Popularité</label>
                    <input type="number" id="cheat-popularity" value="${Math.floor(player.popularity)}">
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="this.closest('.custom-modal-overlay').remove()">Annuler</button>
                <button onclick="applyCheats()" style="background: linear-gradient(135deg, #ff00ff 0%, #8b008b 100%);">APPLIQUER</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function applyCheats() {
    const money = parseInt(document.getElementById('cheat-money').value);
    const fans = parseInt(document.getElementById('cheat-fans').value);
    const health = parseInt(document.getElementById('cheat-health').value);
    const popularity = parseInt(document.getElementById('cheat-popularity').value);

    if (!isNaN(money)) player.money = money;
    if (!isNaN(fans)) player.fans = fans;
    if (!isNaN(health)) player.health = Math.min(100, Math.max(0, health));
    if (!isNaN(popularity)) player.popularity = popularity;

    updateDisplay();
    showNotification('✨ Réalité altérée avec succès !', 'success');

    const modal = document.querySelector('.custom-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}
