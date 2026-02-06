import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { QuizApi } from "../../../utils/Controllers/QuizApi";
import { Alert } from "../../../utils/Alert";

export default function Edit({ refresh, data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [count, setCount] = useState("");
    const [time, setTime] = useState("");

    // предзаполняем поля при открытии modal
    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setCount(data.count || "");
            setTime(data.time || "");
        }
    }, [data]);

    const handleOpen = () => setOpen(!open);

    const handleEditQuiz = async () => {
        if (!name || !count || !time) {
            Alert("Barcha maydonlarni to‘ldiring", "warning");
            return;
        }

        try {
            setLoading(true);

            await QuizApi.Edit(data?.id, {
                name,
                count: Number(count),
                time: Number(time),
            });

            Alert("Quiz muvaffaqiyatli o‘zgartirildi!", "success");

            setOpen(false);
            refresh(); // обновляем список после редактирования
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
            {/* Кнопка открытия */}
            <Button
                size="sm"
                onClick={handleOpen}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
                O'zgartirish
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5">
                        Quizni o‘zgartirish
                    </Typography>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Quiz nomi"
                        placeholder="JavaScript Basics Quiz"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Savollar soni"
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                    />

                    <Input
                        label="Vaqt (daqiqada)"
                        type="number"
                        min={1}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
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
                        onClick={handleEditQuiz}
                        disabled={loading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                        {loading ? "O‘zgartirilmoqda..." : "O‘zgartirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
