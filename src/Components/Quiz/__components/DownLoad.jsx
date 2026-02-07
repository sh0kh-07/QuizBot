import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { QuizApi } from "../../../utils/Controllers/QuizApi";
import { Alert } from "../../../utils/Alert";

export default function DownLoad({ quizId }) {
    const [loading, setLoading] = useState(false);

    const DownloadExcel = async () => {
        try {
            setLoading(true);
            const response = await QuizApi.Download(quizId);

            const blob = new Blob([response.data], {
                type:
                    response.headers["content-type"] ||
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Fayl nomini response header dan olish yoki default
            const contentDisposition = response.headers["content-disposition"];
            const fileName = contentDisposition
                ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
                : `quiz-${quizId}.xlsx`;

            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
            Alert("Hali hech kim test ishlamagan", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={DownloadExcel} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Yuklab olish"}
        </Button>
    );
}