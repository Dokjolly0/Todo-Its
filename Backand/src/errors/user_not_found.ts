export class UtenteNonTrovatoError extends Error {
  constructor(message?: string) {
    super(message || "Utente non trovato");
    this.name = "UtenteNonTrovatoError";
  }
}
