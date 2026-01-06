// Démarrage du jeu
function startGame() {
    const name = document.getElementById('playerName').value.trim();
    const instrument = document.getElementById('instrument').value;
    if (!name) {
        showNotification('Hey Rockstar ! Entre un nom de scène !', 'error');
        return;
    }

    player.name = name;
    player.instrument = instrument;
    player.isDead = false;

    // Code secret : stats infinies
    if (name === 'Konami Code') {
        player.infiniteMoney = true;
        player.infiniteStats = true;
        showNotification('CHEAT ACTIVATED: GOD MODE', 'info');
    }

    startGameLoop();
}

// Boucle centrale du jeu (unifiée)
function startGameLoop() {
    document.getElementById('creationScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    updateDisplay();
    showView('concert');

    // Nettoyer l'ancienne boucle si elle existe
    if (window.gameInterval) clearInterval(window.gameInterval);

    window.gameInterval = setInterval(() => {
        gameTime++;
        if (gameTime % 30 === 0) passTime();
        updateCooldowns();
        updateAlbums();
    }, 1000);

    showNotification(`Bienvenue sur scène, ${player.name} !`, 'success');
}

// Gestion du temps
function passTime() {
    // Calcul de l'âge sans flottant (utilisation de jours/mois virtuels serait mieux, mais on garde simple)
    // On arrondit pour éviter 18.150000002
    player.age = parseFloat((player.age + 0.15).toFixed(2));

    // Code secret : stats infinies
    if (player.infiniteStats) {
        player.money = 999999;
        player.fans = 999999;
        player.popularity = 999999;
    }

    // Gestion de l'addiction
    if (player.addiction > 0) {
        player.health -= player.addiction / 15;
        player.daysWithoutDrugs = 0;
        if (Math.random() < 0.1) {
            player.addiction = Math.max(0, player.addiction - 0.5);
            showNotification('Ton addiction baisse légèrement...', 'info');
        }
    } else {
        // 0.15 an = environ 55 jours, donc on incrémente proportionnellement
        player.daysWithoutDrugs += 55;
        if (player.health < 100) player.health += 0.5;
    }

    // Coûts de maintenance
    if (gameTime % 90 === 0 && hasAnyEquipment()) {
        let maintenanceCost = calculateMaintenance();
        player.money -= maintenanceCost;
        showFloatingText(window.innerWidth / 2, window.innerHeight / 2, `-${maintenanceCost}€ (Maintenance)`, '#ff4444');
        if (player.money < 0) {
            player.health -= 5;
            showNotification('Attention ! Tu es à découvert !', 'error');
        }
    }

    // Perte de popularité
    if (gameTime % 120 === 0 && player.popularity > 0) {
        const loss = Math.floor(player.popularity * 0.02);
        player.popularity = Math.max(0, player.popularity - loss);
        if (loss > 0) showNotification('Ta popularité baisse légèrement avec le temps...', 'info');
    }

    // Effets du vieillissement
    if (player.age > 50 && Math.random() < 0.02) { player.health -= Math.random() * 5; showNotification('Le dos qui grince...', 'info'); }
    if (player.age > 60 && Math.random() < 0.05) { player.health -= Math.random() * 10; showNotification('La vieillesse te rattrape...', 'info'); }
    if (player.age > 70 && Math.random() < 0.08) player.health -= Math.random() * 15;
    if (player.age > 80) player.health -= 0.5;

    player.health = Math.max(0, player.health);

    if (player.health <= 0 || player.money < 0) gameOver();

    if (gameTime % 30 === 0) saveGame();

    updateDisplay();
}

// Gestion des cooldowns
function updateCooldowns() {
    let busy = false;

    // Training
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) {
            player.trainingCooldowns[skill]--;
            const skillName = skills.find(s => s.key === skill)?.name || skill;
            showProgressNotification(`train-${skill}`, `🏋️ Entraînement ${skillName}: ${player.trainingCooldowns[skill]}s`);
            busy = true;
        } else {
            closeNotification(`train-${skill}`);
        }
    }

    // Concert
    if (player.concertCooldown > 0) {
        player.concertCooldown--;
        showProgressNotification('concert', `🎤 Concert en cours: ${player.concertCooldown}s`);
        busy = true;
    } else {
        closeNotification('concert');
    }

    // Album
    if (player.albumCooldown > 0) {
        player.albumCooldown--;
        showProgressNotification('album', `💿 Enregistrement: ${player.albumCooldown}s`);
        busy = true;
    } else {
        closeNotification('album');
    }

    // Repos
    if (player.restCooldown > 0) {
        player.restCooldown--;
        showProgressNotification('rest', `💤 Repos en cours: ${player.restCooldown}s`);
        busy = true;
    } else {
        closeNotification('rest');
    }

    // Party
    if (player.partyCooldown > 0) {
        player.partyCooldown--;
        showProgressNotification('party', `🎉 La fête bat son plein: ${player.partyCooldown}s`);
        busy = true;
    } else {
        closeNotification('party');
    }

    // Mise à jour de la vue SI nécessaire (pas pour le timer, mais pour les boutons grisés)
    if ((currentView === 'training' || currentView === 'concert' || currentView === 'albums' || currentView === 'lifestyle') && !busy) {
        // On rafraichit seulement si on n'est PLUS occupé (pour réactiver les boutons)
        // ou si on vient de changer d'état. 
        // Pour éviter le spam "figé", on ne call pas showView à chaque seconde si rien ne change visuellement à part le timer (qui est mtn dans la notif)
        // Mais il faut que les boutons se grisent au début...
        // On va laisser le refresh mais optimisé ou accepter que les boutons restent grisés via isPlayerBusy()
        showView(currentView);
    } else if (busy && gameTime % 5 === 0) {
        // Rafraichir moins souvent (toutes les 5s) quand occupé, juste pour être sûr
        // showView(currentView); 
        // En fait, on peut s'en passer si les boutons utilisent isPlayerBusy() qui lit les valeurs actuelles.
        // Mais il faut rafraichir pour DISABLE les boutons au début.
        if (document.querySelector('button:not(:disabled)')) showView(currentView); // Hack simple pour re-render si des boutons sont actifs alors qu'ils ne devraient pas
    }
}

// Mise à jour des revenus des albums
function updateAlbums() {
    player.albums.forEach(album => {
        // Revenus par minute pour les albums populaires (sauf démos)
        if (album.isPopular && album.albumTypeKey !== 'demo' && gameTime % 60 === 0) {
            const revenue = album.revenuePerMinute;
            const newFans = album.fansPerMinute;
            player.money += revenue;
            player.fans += newFans;
        }
    });
}

// Vérifier si le joueur est occupé
function isPlayerBusy() {
    return player.concertCooldown > 0 || player.albumCooldown > 0 || player.restCooldown > 0 || player.partyCooldown > 0 || hasTrainingCooldown();
}

// Vérifier si un entraînement est en cours
function hasTrainingCooldown() {
    for (let skill in player.trainingCooldowns) {
        if (player.trainingCooldowns[skill] > 0) return true;
    }
    return false;
}

// Fin de partie
function gameOver() {
    player.isDead = true;
    if (window.gameInterval) clearInterval(window.gameInterval); // Arrêter la boucle

    let cause = '';
    if (player.money < 0) {
        cause = 'Faillite... Tu es dans le négatif et ruiné.';
    } else if (player.addiction > 70) {
        cause = 'Overdose... La drogue a eu raison de toi.';
    } else if (player.age > 70) {
        cause = 'Vieillesse... Tu as vécu ta vie à fond.';
    } else {
        cause = 'Santé défaillante... Le rock n\'roll a épuisé ton corps.';
    }

    const careerRecord = {
        name: player.name,
        instrument: player.instrument,
        age: Math.floor(player.age),
        money: player.money,
        fans: player.fans,
        popularity: player.popularity,
        concerts: player.concertsPlayed,
        albums: player.albums.length,
        group: player.group?.name || 'Solo',
        cause: cause,
        date: new Date().toLocaleString('fr-FR')
    };

    careerHistory.unshift(careerRecord);
    if (careerHistory.length > 20) careerHistory = careerHistory.slice(0, 20);
    localStorage.setItem('careerHistory', JSON.stringify(careerHistory));
    localStorage.removeItem('currentGame');

    document.getElementById('deathMessage').innerHTML = `
        <div style="color: #ff0000;">${player.name} est mort à ${Math.floor(player.age)} ans</div>
        <div style="color: #ff6b6b; margin-top: 10px;">${cause}</div>`;

    document.getElementById('deathStats').innerHTML = `
        <div style="color: #fff;">
            <p>💰 Argent gagné: ${formatNumber(player.money)} €</p>
            <p>👥 Fans totaux: ${formatNumber(player.fans)}</p>
            <p>🎵 Concerts joués: ${player.concertsPlayed}</p>
            <p>💿 Albums sortis: ${player.albums.length}</p>
            <p>⭐ Popularité maximale: ${formatNumber(player.popularity)}</p>
            ${player.group ? `<p>🎸 Dernier groupe: ${player.group.name}</p>` : ''}
        </div>`;

    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('deathScreen').classList.add('active');
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    loadGame();
});