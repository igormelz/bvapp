import { useState, useEffect } from 'react'
import axios from 'axios'
import { useKeycloak } from '@react-keycloak/web'

export const useAuthApi = () => {
  const [keycloak, initialized] = useKeycloak()
  const [axiosInstance, setAxiosInstance] = useState({})

  useEffect(() => {
    console.log("start authApi");
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
      },
    })

    setAxiosInstance({ instance })

    return () => {
      setAxiosInstance({})
    }
  }, [initialized, keycloak, keycloak.token])

  return axiosInstance.instance
}