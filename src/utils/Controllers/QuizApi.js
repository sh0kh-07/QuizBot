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
        let url = `/quizzes/page?page=${data?.page || 1}`;

        // Добавляем startDate только если он не null/undefined
        if (data?.startDate) {
            url += `&startDate=${data.startDate}`;
        }

        // Добавляем endDate только если он не null/undefined
        if (data?.endDate) {
            url += `&endDate=${data.endDate}`;
        }

        const response = await $api.get(url);
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
        const response = await $api.get(`/quizzes/excel/${id}`, {
            responseType: "blob",
        });
        return response;
    };
}

export { QuizApi };