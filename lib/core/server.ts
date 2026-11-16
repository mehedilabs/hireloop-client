import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
export const getSession  = async () => {
   
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session
};

export const getToken = async () =>{
    const session = await getSession();
    if(!session || !session.session?.token){
        redirect("/unauthorized")
    }
    return session.session.token;
}

export const authFetch = async(api:string) => {
    const token = await getToken();
    const res = await fetch(api, {
        headers: {
            authorization: `bearer ${token}`
        }
    })
    return res;
}

export const requireRole = async (role: string) =>{
    const session = await getSession();
    if(!session || session?.user.role !== role){
        redirect("/unauthorized")
    }
    return session;
}
