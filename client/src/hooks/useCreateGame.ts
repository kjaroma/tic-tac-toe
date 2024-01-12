import axios, { AxiosError } from 'axios';
import { URLS } from '../constants';
import { OnSuccessData } from '../common/types';
import { useCallback } from 'react';

function useCreateGame(onSuccessData: OnSuccessData<string>) {
    const createGame = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
            const response = await axios.get(URLS.createGame, { withCredentials: true })
            onSuccessData(response.data.gameId)
        } catch (e) {
            console.log((e as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Game creation failed')
        }
    }, [onSuccessData])
    return { createGame }
}

export default useCreateGame;