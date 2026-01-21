# 🔧 Correction: Persistance des données base de données

## 🐛 Problème identifié

**La base de données H2 était configurée en mode mémoire** (`jdbc:h2:mem:banque_ega`)

Cela signifiait que :
- ❌ Les données étaient stockées **uniquement en RAM**
- ❌ À chaque redémarrage de l'application, **la base était entièrement réinitialisée**
- ❌ Tous les enregistrements créés disparaissaient après déconnexion/reconnexion

## ✅ Solution appliquée

### Modification du fichier `application.properties`

**Avant:**
```properties
spring.datasource.url=jdbc:h2:mem:banque_ega
```

**Après:**
```properties
spring.datasource.url=jdbc:h2:file:./data/banque_ega;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

### Paramètres expliqués:

| Paramètre | Signification |
|-----------|---------------|
| `file:./data/banque_ega` | La BD est sauvegardée dans le dossier `./data/banque_ega` sur le disque |
| `DB_CLOSE_DELAY=-1` | Empêche la fermeture immédiate de la BD (maintient les connexions) |
| `DB_CLOSE_ON_EXIT=FALSE` | La BD ne se ferme pas quand JVM s'arrête (permet la persistance) |

## 📁 Structure créée

Après le premier redémarrage, le dossier suivant sera créé:
```
backend/
└── data/
    └── banque_ega.mv.db      (fichier de la base de données)
```

## 🚀 Résultat attendu

✅ Les données **persisteront** entre les redémarrages  
✅ Les enregistrements seront **conservés** même après fermeture  
✅ Chaque démarrage **lira les données existantes**  
✅ Le DataInitializer ne créera les données initiales qu'à la **première exécution**

## 🔍 Vérification

1. Redémarrer l'application
2. Se connecter et créer des enregistrements
3. Se déconnecter et fermer l'application
4. Relancer l'application
5. ✅ Les enregistrements doivent être présents

## 💡 Notes supplémentaires

- Le dossier `data/` ne doit **pas** être pushé sur Git (ajouter à `.gitignore`)
- Pour développement local, cette configuration est parfaite
- Pour la production, utiliser une **vraie BD** (MySQL, PostgreSQL, etc.)
