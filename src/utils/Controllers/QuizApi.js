import { $api } from "../Headers";

class QuizApi {
    static Create = async (data) => {
        const response = await $api.post(`/quizzes`, data)
        return response;
    }
    static Get = async (page) => {
        const response = await $api.get(`/quizzes/page?page=${page}`)
        return response;
    }
    static GetStartDate_EndDate = async (data) => {
        const response = await $api.get(`/quizzes/page?startDate=${data?.startDate}&endDate=${data?.endDate}&page=${data?.page}`)
        return response;
    }
    static Get = async (page) => {
        const response = await $api.get(`/quizzes/page?page=${page}`)
        return response;
    }
    static GetById = async (id) => {
        const response = await $api.get(`/quizzes/${id}`)
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/quizzes/${id}`)
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/quizzes/${id}`, data)
        return response;
    }
    static Download = async (id) => {
        const response = await $api.get(`/quizzes/excel/${id}`)
        return response;
    }
}

export { QuizApi };