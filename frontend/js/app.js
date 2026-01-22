// Configuration de l'API
const API_BASE_URL = 'http://localhost:8080/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    if (authToken && currentUser.username) {
        showMainApp();
        loadDashboardData();
    } else {
        showLoginSection();
    }
});

// Gestion de l'authentification
function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    hideAllMainSections();
    document.getElementById('userMenu').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('userMenu').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('username').textContent = currentUser.username;
    showSection('dashboard');
}

// Connexion
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = {
                username: data.username,
                email: data.email,
                role: data.role
            };
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Connexion réussie !', 'success');
            showMainApp();
            loadDashboardData();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erreur de connexion', 'danger');
        }
    } catch (error) {
        showNotification('Erreur de connexion au serveur', 'danger');
        console.error('Erreur:', error);
    }
});

// Inscription
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = {
                username: data.username,
                email: data.email,
                role: data.role
            };
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Inscription réussie !', 'success');
            showMainApp();
            loadDashboardData();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erreur d\'inscription', 'danger');
        }
    } catch (error) {
        showNotification('Erreur de connexion au serveur', 'danger');
        console.error('Erreur:', error);
    }
});

// Déconnexion
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = {};
    showLoginSection();
    showNotification('Déconnexion réussie', 'info');
}

// Navigation entre les sections
function showSection(sectionName) {
    hideAllMainSections();
    document.getElementById(sectionName + 'Section').style.display = 'block';
    
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'clients':
            loadClients();
            break;
        case 'comptes':
            loadComptes();
            break;
        case 'transactions':
            loadTransactions();
            break;
    }
}

function hideAllMainSections() {
    const sections = ['dashboard', 'clients', 'comptes', 'transactions'];
    sections.forEach(section => {
        const element = document.getElementById(section + 'Section');
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Utilitaires pour les requêtes API
async function apiRequest(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            logout();
            throw new Error('Session expirée');
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur API');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Chargement des données du tableau de bord
async function loadDashboardData() {
    try {
        const [clients, comptes, transactions] = await Promise.all([
            apiRequest('/clients'),
            apiRequest('/comptes'),
            apiRequest('/transactions')
        ]);
        
        document.getElementById('totalClients').textContent = clients.length;
        document.getElementById('totalComptes').textContent = comptes.length;
        
        // Calculer les transactions d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const transactionsToday = transactions.filter(t => 
            t.dateTransaction.startsWith(today)
        );
        document.getElementById('transactionsToday').textContent = transactionsToday.length;
        
        // Calculer le solde total
        const soldeTotal = comptes.reduce((total, compte) => total + compte.solde, 0);
        document.getElementById('soldeTotal').textContent = `${soldeTotal.toLocaleString()} FCFA`;
        
    } catch (error) {
        showNotification('Erreur lors du chargement du tableau de bord', 'danger');
    }
}

// Gestion des clients
async function loadClients() {
    try {
        const clients = await apiRequest('/clients');
        const tbody = document.querySelector('#clientsTable tbody');
        tbody.innerHTML = '';
        
        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.nom}</td>
                <td>${client.prenom}</td>
                <td>${client.courriel}</td>
                <td>${client.numeroTelephone}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewClient(${client.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editClient(${client.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showNotification('Erreur lors du chargement des clients', 'danger');
    }
}

function showAddClientModal() {
    const modal = new bootstrap.Modal(document.getElementById('addClientModal'));
    modal.show();
}

async function addClient() {
    const form = document.getElementById('addClientForm');
    const formData = new FormData(form);
    const clientData = Object.fromEntries(formData.entries());
    
    try {
        await apiRequest('/clients', {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
        
        showNotification('Client ajouté avec succès', 'success');
        bootstrap.Modal.getInstance(document.getElementById('addClientModal')).hide();
        form.reset();
        loadClients();
    } catch (error) {
        showNotification(error.message || 'Erreur lors de l\'ajout du client', 'danger');
    }
}

// Gestion des comptes
async function loadComptes() {
    try {
        const comptes = await apiRequest('/comptes');
        const tbody = document.querySelector('#comptesTable tbody');
        tbody.innerHTML = '';
        
        comptes.forEach(compte => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${compte.numeroCompte}</td>
                <td><span class="badge bg-primary">${compte.typeCompte}</span></td>
                <td>${compte.proprietairePrenom} ${compte.proprietaireNom}</td>
                <td>${compte.solde.toLocaleString()} FCFA</td>
                <td>${new Date(compte.dateCreation).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewCompte('${compte.numeroCompte}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="showDepotModal('${compte.numeroCompte}')">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="showRetraitModal('${compte.numeroCompte}')">
                        <i class="fas fa-minus"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showNotification('Erreur lors du chargement des comptes', 'danger');
    }
}

// Gestion des transactions
async function loadTransactions() {
    try {
        const transactions = await apiRequest('/transactions');
        const tbody = document.querySelector('#transactionsTable tbody');
        tbody.innerHTML = '';
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.dateTransaction).toLocaleString()}</td>
                <td><span class="badge bg-info">${transaction.typeTransaction}</span></td>
                <td>${transaction.numeroCompte}</td>
                <td>${transaction.montant.toLocaleString()} FCFA</td>
                <td>${transaction.description || '-'}</td>
                <td>${transaction.soldeApres.toLocaleString()} FCFA</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        showNotification('Erreur lors du chargement des transactions', 'danger');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.innerHTML = `
        <strong>${type === 'success' ? 'Succès!' : type === 'danger' ? 'Erreur!' : 'Info!'}</strong>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Fonctions pour les modals (à implémenter)
function showAddCompteModal() {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function showDepotModal(numeroCompte = '') {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function showRetraitModal(numeroCompte = '') {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function showVirementModal() {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function showReleveModal() {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function viewClient(id) {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function editClient(id) {
    showNotification('Fonctionnalité en cours de développement', 'info');
}

function deleteClient(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        showNotification('Fonctionnalité en cours de développement', 'info');
    }
}

function viewCompte(numeroCompte) {
    showNotification('Fonctionnalité en cours de développement', 'info');
}