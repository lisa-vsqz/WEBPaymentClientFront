import NextAuth from 'next-auth';
import CredentialsProviders from 'next-auth/providers/credentials';

const authOptions = {
    session:{
        strategy: 'jwt',
    },
    providers:[
        CredentialsProviders({
            name: "Credentials",
            credentials:{
                email: {label: "Email", type: "email", placeholder: "example@email.com" },
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const res = await fetch("http://localhost:5000/api/users/login", {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                  }),
                });
        
                const data = await res.json();
        
                if (res.ok && data.token) {
                  return { ...data.user, token: data.token };
                } else {
                  return null;
                }
              },
        })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.role = user.role;
          token.accessToken = user.token; // Almacenar el token JWT
        }
        return token;
      },
      async session({ session, token }) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
        session.accessToken = token.accessToken; // Agregar el token JWT a la sesión
        return session;
      },
    },
};
//export default NextAuth(authOptions);

// Crear el manejador de NextAuth
const handler = NextAuth(authOptions);

// Exportar las funciones nombradas para cada método HTTP
export { handler as GET, handler as POST };