import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { useParams } from "react-router-dom";
import { Alert } from "../../utils/Alert";

export default function Edit({ data, refresh }) {
    const { id: quizId } = useParams();


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");

    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        if (data?.question) {
            setQuestion(data.question);
        }
    }, [data]);

    const EditQuestion = async () => {
        if (!question.trim()) {
            Alert("Savol matnini kiriting", "warning");
            return;
        }

        try {
            setLoading(true);

            await QuestionApi.Edit(data.id, {
                quizId,
                question,
            });

            Alert("Savol muvaffaqiyatli yangilandi", "success");
            refresh?.();
            setOpen(false);
        } catch (error) {
            console.log(error);
            Alert(
                error?.response?.data?.message || "Xatolik yuz berdi",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* OPEN BUTTON */}
            <Button
                size="sm"
                color="yellow"
                onClick={handleOpen}
            >
                <svg className="text-white h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z" /></svg>
            </Button>

            {/* MODAL */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5">
                        Savolni tahrirlash
                    </Typography>
                </DialogHeader>

                <DialogBody className="space-y-4">
                    <Input
                        label="Savol matni"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What is JavaScript?"
                    />
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        onClick={EditQuestion}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
