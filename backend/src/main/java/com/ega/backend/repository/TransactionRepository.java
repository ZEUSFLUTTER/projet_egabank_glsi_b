package com.ega.backend.repository;

import com.ega.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByCompteSourceId(String compteId);
    List<Transaction> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Transaction> findByCompteSourceIdAndDateBetween(String compteId, LocalDateTime start, LocalDateTime end);

    // ❌ Supprime ou remplace cette ligne :
    // List<Transaction> findByCompteSourceIdOrCompteDestId(String compteSourceId, String compteDestId);

    // ✅ Ajoute cette nouvelle méthode (ou remplace l'ancienne mal nommée)
    @Query("{'$or': [{'compteSourceId': ?0}, {'compteDestId': ?0}]}")
    List<Transaction> findByCompteSourceIdOrCompteDestId(String compteId);

    @Query("{ $or: [{ 'compteSourceId': ?0 }, { 'compteDestId': ?0 }], 'date': { $gte: ?1, $lte: ?2 }}")
    List<Transaction> findByCompteSourceIdOrCompteDestIdAndDateBetween(String compteId, LocalDateTime startDate, LocalDateTime endDate);

    // ✅ Nouvelle méthode : Recherche par plusieurs IDs de comptes
    @Query("{ $or: [{ 'compteSourceId': { $in: ?0 } }, { 'compteDestId': { $in: ?1 } }] }")
    List<Transaction> findByCompteSourceIdInOrCompteDestIdIn(List<String> compteSourceIds, List<String> compteDestIds);
}