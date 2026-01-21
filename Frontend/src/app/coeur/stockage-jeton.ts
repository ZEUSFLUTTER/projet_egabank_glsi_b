export class StockageJeton {
  private static cleJeton = 'jeton_banque';
  private static cleUtilisateur = 'nom_utilisateur_banque';

  static enregistrer(jeton: string): void {
    localStorage.setItem(this.cleJeton, jeton);
  }

  static lire(): string | null {
    return localStorage.getItem(this.cleJeton);
  }

  static enregistrerNomUtilisateur(nomUtilisateur: string): void {
    localStorage.setItem(this.cleUtilisateur, nomUtilisateur);
  }

  static lireNomUtilisateur(): string {
    return localStorage.getItem(this.cleUtilisateur) || '';
  }

  static supprimer(): void {
    localStorage.removeItem(this.cleJeton);
    localStorage.removeItem(this.cleUtilisateur);
  }

  static estExpire(jeton?: string | null): boolean {
    if (!jeton) return true;
    try {
      const payload = JSON.parse(atob(jeton.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  static estConnecte(): boolean {
    const jeton = this.lire();
    return !!jeton && !this.estExpire(jeton);
  }
}
