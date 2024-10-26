export interface UserCreate {
    name: string;
    email: string;
    phone?: string; // Telefone é opcional
    password?: string; // Senha é opcional, pois pode não ser usada para login com Google
    idAuthGoogle?: string; // ID de autenticação do Google
}