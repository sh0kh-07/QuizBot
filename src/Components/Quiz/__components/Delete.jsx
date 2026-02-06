import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import { QuizApi } from "../../../utils/Controllers/QuizApi";
import { Alert } from "../../../utils/Alert";
import { Trash2 } from "lucide-react";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await QuizApi.Delete(id);  // Предполагается, что у тебя есть метод Delete
            Alert("Quiz muvaffaqiyatli o‘chirildi", "success");
            setOpen(false);
            refresh();  // обновляем список после удаления
        } catch (err) {
            console.log(err);
            Alert(err?.response?.data?.message || "Xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Кнопка открыть modal */}
            <Button
                onClick={handleOpen}
                size="sm"
                className="bg-red-500 hover:bg-red-600 justify-center text-white flex items-center gap-1"
            >
                <Trash2 className="w-4 h-4" />
                O‘chirish
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span>Quizni o‘chirish</span>
                </DialogHeader>

                <DialogBody divider>
                    <Typography className="text-gray-700 text-sm">
                        Siz rostdan ham ushbu quizni o‘chirmoqchimisiz? Bu amalni qaytarib bo‘lmaydi.
                    </Typography>
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {loading ? "O‘chirilmoqda..." : "O‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
