import { Button } from "@material-tailwind/react";
import { QuizApi } from "../../../utils/Controllers/QuizApi";

export default function DownLaod({ quizId }) {

    const DownloadExel = async () => {
        try {
            const response = await QuizApi.Download(quizId)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Button onClick={DownloadExel} size="sm">
                Yuklab olish
            </Button>
        </>
    )
}