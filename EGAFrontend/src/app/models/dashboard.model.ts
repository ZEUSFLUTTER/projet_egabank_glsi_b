import { Transaction } from "./transaction.model";

export interface Dashboard {
    totalClients: number;
    diffClients: number;
    totalComptes: number;
    diffComptes: number;
    totalTransactions: number;
    diffTransactions: number;
    volume: number;
    diffVolume: number;
    nbCourant: number;
    soldeCourant: number;
    nbEpargne: number;
    soldeEpargne: number;
    dernieresTransactions: Transaction[]
}