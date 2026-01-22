import json

# Create comprehensive Postman collection
collection = {
    "info": {
        "name": "Banque EGA API - Collection Complète",
        "description": "Collection Postman professionnelle pour tester tous les endpoints de l'API Banque EGA avec tests automatisés, validation et gestion des variables",
        "version": "2.0.0",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {"key": "baseUrl", "value": "http://localhost:8080", "type": "string", "description": "URL de base de l'API"},
        {"key": "token", "value": "", "type": "string", "description": "Token JWT d'authentification"},
        {"key": "clientId", "value": "", "type": "string", "description": "ID du client créé pour les tests"},
        {"key": "compteId", "value": "", "type": "string", "description": "ID du compte créé pour les tests"},
        {"key": "compteId2", "value": "", "type": "string", "description": "ID du second compte pour les virements"},
        {"key": "transactionId", "value": "", "type": "string", "description": "ID de la transaction créée"}
    ],
    "auth": {
        "type": "bearer",
        "bearer": [{"key": "token", "value": "{{token}}", "type": "string"}]
    },
    "event": [
        {
            "listen": "prerequest",
            "script": {
                "type": "text/javascript",
                "exec": ["console.log('Exécution: ' + pm.info.requestName);"]
            }
        }
    ],
    "item": [
        {
            "name": "🔐 Authentification",
            "description": "Endpoints pour l'authentification des utilisateurs",
            "item": [
                {
                    "name": "Register - Inscription",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test('Status code is 201', function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});",
                                    "",
                                    "pm.test('Response has token', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData).to.have.property('token');",
                                    "    pm.expect(jsonData.token).to.not.be.empty;",
                                    "    pm.collectionVariables.set('token', jsonData.token);",
                                    "});",
                                    "",
                                    "pm.test('Response has user info', function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData).to.have.property('user');",
                                    "    pm.expect(jsonData.user).to.have.property('courriel');",
                                    "});"
                                ]
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": json.dumps({
                                "nom": "Dupont",
                                "prenom": "Jean", 
                                "courriel": "jean.dupont@banque-ega.com",
                                "motDePasse": "SecurePass123!",
                                "dateNaissance": "1990-01-15",
                                "sexe": "M",
                                "adresse": "123 Rue de la République, 75001 Paris",
                                "telephone": "0612345678",
                                "nationalite": "Française"
                            }, indent=2),
                            "options": {"raw": {"language": "json"}}
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/auth/register",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "auth", "register"]
                        },
                        "description": "Créer un nouveau compte utilisateur avec validation complète des données"
                    }
                }
            ]
        }
    ]
}

# Write to file
with open('postman_collection.json', 'w', encoding='utf-8') as f:
    json.dump(collection, f, indent=2, ensure_ascii=False)

print("Collection Postman générée avec succès!")