export class StockageJeton {
  private static readonly CLE_JETON = 'jeton_espace_client';
  private static readonly CLE_CLIENT = 'client_connecte';

  static sauvegarderJeton(jeton: string): void {
    localStorage.setItem(this.CLE_JETON, jeton);
  }

  static obtenirJeton(): string | null {
    return localStorage.getItem(this.CLE_JETON);
  }

  static supprimerJeton(): void {
    localStorage.removeItem(this.CLE_JETON);
    localStorage.removeItem(this.CLE_CLIENT);
  }

  static sauvegarderClient(client: any): void {
    localStorage.setItem(this.CLE_CLIENT, JSON.stringify(client));
  }

  static obtenirClient(): any | null {
    const client = localStorage.getItem(this.CLE_CLIENT);
    return client ? JSON.parse(client) : null;
  }

  static estConnecte(): boolean {
    const jeton = this.obtenirJeton();
    if (!jeton) return false;
    
    try {
      const payload = JSON.parse(atob(jeton.split('.')[1]));
      const maintenant = Date.now() / 1000;
      return payload.exp > maintenant;
    } catch {
      return false;
    }
  }
}