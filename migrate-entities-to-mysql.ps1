# Script de migration automatique des entités MongoDB vers MySQL
Write-Host "🔄 MIGRATION ENTITÉS MONGODB → MYSQL" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$entityPath = "Ega backend/Ega-backend/src/main/java/com/example/Ega/backend/entity"
$repositoryPath = "Ega backend/Ega-backend/src/main/java/com/example/Ega/backend/repository"

Write-Host "`n📁 Chemins détectés:" -ForegroundColor Yellow
Write-Host "   Entités: $entityPath" -ForegroundColor Gray
Write-Host "   Repositories: $repositoryPath" -ForegroundColor Gray

# Vérifier que les dossiers existent
if (-not (Test-Path $entityPath)) {
    Write-Host "❌ Dossier entités non trouvé: $entityPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $repositoryPath)) {
    Write-Host "❌ Dossier repositories non trouvé: $repositoryPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 MIGRATION DES ENTITÉS:" -ForegroundColor Yellow
Write-Host "-------------------------"

# Liste des entités à migrer
$entities = @("Client", "User", "Compte", "Transaction")

foreach ($entity in $entities) {
    $entityFile = "$entityPath/$entity.java"
    
    if (Test-Path $entityFile) {
        Write-Host "📝 Migration de $entity.java..." -ForegroundColor White
        
        # Lire le contenu du fichier
        $content = Get-Content $entityFile -Raw
        
        # Sauvegarder l'original
        $backupFile = "$entityFile.mongodb.backup"
        Copy-Item $entityFile $backupFile
        Write-Host "   💾 Sauvegarde créée: $entity.java.mongodb.backup" -ForegroundColor Gray
        
        # Remplacements MongoDB → MySQL/JPA
        $content = $content -replace 'import org\.springframework\.data\.mongodb\.core\.mapping\.Document;', 'import jakarta.persistence.*;'
        $content = $content -replace 'import org\.springframework\.data\.annotation\.Id;', 'import jakarta.persistence.*;'
        $content = $content -replace '@Document\(collection = "[^"]*"\)', '@Entity'
        $content = $content -replace '@Document', '@Entity'
        
        # Ajouter @Table si pas présent
        if ($content -notmatch '@Table') {
            $tableName = $entity.ToLower() + "s"
            $content = $content -replace '(@Entity)', "`$1`n@Table(name = `"$tableName`")"
        }
        
        # Remplacer les IDs String par Long avec auto-génération
        $content = $content -replace 'private String id;', '@Id`n    @GeneratedValue(strategy = GenerationType.IDENTITY)`n    private Long id;'
        
        # Remplacer les références d'ID String par Long dans les getters/setters
        $content = $content -replace 'public String getId\(\)', 'public Long getId()'
        $content = $content -replace 'public void setId\(String id\)', 'public void setId(Long id)'
        
        # Écrire le fichier modifié
        Set-Content $entityFile $content -Encoding UTF8
        Write-Host "   ✅ $entity.java migré vers MySQL/JPA" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ $entity.java non trouvé" -ForegroundColor Yellow
    }
}

Write-Host "`n🔧 MIGRATION DES REPOSITORIES:" -ForegroundColor Yellow
Write-Host "-------------------------------"

# Liste des repositories à migrer
$repositories = @("ClientRepository", "UserRepository", "CompteRepository", "TransactionRepository")

foreach ($repo in $repositories) {
    $repoFile = "$repositoryPath/$repo.java"
    
    if (Test-Path $repoFile) {
        Write-Host "📝 Migration de $repo.java..." -ForegroundColor White
        
        # Lire le contenu du fichier
        $content = Get-Content $repoFile -Raw
        
        # Sauvegarder l'original
        $backupFile = "$repoFile.mongodb.backup"
        Copy-Item $repoFile $backupFile
        Write-Host "   💾 Sauvegarde créée: $repo.java.mongodb.backup" -ForegroundColor Gray
        
        # Remplacements MongoDB → JPA
        $content = $content -replace 'import org\.springframework\.data\.mongodb\.repository\.MongoRepository;', 'import org.springframework.data.jpa.repository.JpaRepository;'
        $content = $content -replace 'MongoRepository<([^,]+), String>', 'JpaRepository<$1, Long>'
        
        # Écrire le fichier modifié
        Set-Content $repoFile $content -Encoding UTF8
        Write-Host "   ✅ $repo.java migré vers JPA" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ $repo.java non trouvé" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 RÉSUMÉ DE LA MIGRATION:" -ForegroundColor Yellow
Write-Host "--------------------------"
Write-Host "✅ Entités migrées: MongoDB @Document → JPA @Entity" -ForegroundColor Green
Write-Host "✅ IDs migrés: String → Long avec @GeneratedValue" -ForegroundColor Green
Write-Host "✅ Repositories migrés: MongoRepository → JpaRepository" -ForegroundColor Green
Write-Host "✅ Sauvegardes créées: *.mongodb.backup" -ForegroundColor Green

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Vérifiez les fichiers migrés" -ForegroundColor Gray
Write-Host "2. Ajoutez les relations JPA si nécessaire (@ManyToOne, @OneToMany)" -ForegroundColor Gray
Write-Host "3. Testez la compilation: ./mvnw compile" -ForegroundColor Gray
Write-Host "4. Démarrez MySQL et testez la connexion: ./test-mysql-connectivity.ps1" -ForegroundColor Gray
Write-Host "5. Démarrez Spring Boot: ./mvnw spring-boot:run" -ForegroundColor Gray

Write-Host "`n⚠️ ATTENTION:" -ForegroundColor Yellow
Write-Host "- Les sauvegardes MongoDB sont dans *.mongodb.backup" -ForegroundColor Gray
Write-Host "- Vérifiez manuellement les relations entre entités" -ForegroundColor Gray
Write-Host "- Adaptez les DTOs si nécessaire (String → Long pour les IDs)" -ForegroundColor Gray

Write-Host "`n=====================================" -ForegroundColor Cyan