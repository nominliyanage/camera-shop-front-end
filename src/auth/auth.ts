import {jwtDecode} from 'jwt-decode';
import type {UserData} from "../model/UserData.ts";

export const isTokenExpired = (token: string) => {
    try {
        // Get expiration date time
        const {exp} = jwtDecode(token);
        if (!exp) return true; // Treat when exp date is undefined as expired
        return Date.now() >= exp * 1000;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return true; // Treat invalid tokens as expired
    }
};
export function getUserFromToken(token: string): UserData  {
    try {
        console.log("Decoding token:", token);
        const decodedToken = jwtDecode<any>(token);
        console.log("Decoded user data:", decodedToken);

        // Map `id` to `userId` for compatibility
        return {
            userId: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role,
            email: decodedToken.email || null, // Optional field
            image: decodedToken.image || null // Optional field
        } ;
    } catch (error) {
        console.error("Error decoding token:", error);
        return {userId: null, username: null, role: null}; // Return default values if decoding fails
    }
}