import { useAuth } from "@/store/useAuth"
import { storeToRefs } from "pinia"

export const getHeaders = () => ({
    "Content-Type": "application/json",
})

export const getAuthHeaders = () => ({
    ...getHeaders(),
    "Authorization": `Bearer ${storeToRefs(useAuth()).token.value}`
})