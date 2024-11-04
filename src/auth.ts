import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials", 
      credentials: {
        username: {label: "Username", type: "text", placeholder: "johndoe"}, 
        password: {label: "Password", type: "password", placeholder: "****"}  
      }, 
      async authorize(credentials) {
        if(credentials?.username === "admin" && credentials?.password === "admin1234" ) {
          return {id: '1', name: "Admin", email: "admin@mail.com", role: "admin"}
        } else if (credentials?.username ==='user' && credentials?.password === "user1234") {
          return {id: '2', name: "User", email: "user@mail.com", role: "user"}
        }
        return null 
      }
    })
  ],


  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token.role = user.role 
      }
      return token
    }, 

    async session({session, token}) {
      if(session.user) {
        (session.user as any).role = token.role
      }
      return session
    }, 
  }, 
  pages: {
    signIn: "/signin"
  }
})