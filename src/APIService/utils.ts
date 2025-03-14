import { useAuth } from "@/store/useAuth"
import { storeToRefs } from "pinia"

export const getHeaders = () => ({
    "Content-Type": "application/json",
})

export const getAuthHeaders = () => ({
    ...getHeaders(),
    "Authorization": `Bearer ${storeToRefs(useAuth()).token.value}`
})

export const testServer = async () => {
    const url = storeToRefs(useAuth()).url
    try {
        const res = await fetch(`${url.value}/`, {
            method: `HEAD`,
        })
        if (!res.ok)
            return false
    } catch (error) {
        return false
    }
    return true
}