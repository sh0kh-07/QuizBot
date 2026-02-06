import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { Trash2 } from "lucide-react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { Alert } from "../../utils/Alert";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const DeleteQuestion = async () => {
        try {
            setLoading(true);
            await QuestionApi.Delete(id);

            Alert("Savol o‘chirildi", "success");
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
                color="red"
                onClick={handleOpen}
            >
                <svg className="text-white h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z" /></svg>

            </Button>
            {/* MODAL */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5" className="text-red-600">
                        Savolni o‘chirish
                    </Typography>
                </DialogHeader>

                <DialogBody>
                    <Typography className="text-gray-700">
                        Siz rostdan ham ushbu savolni o‘chirmoqchimisiz?
                        <br />
                        <span className="text-red-500 font-semibold">
                            Bu amalni ortga qaytarib bo‘lmaydi.
                        </span>
                    </Typography>
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
                        color="red"
                        onClick={DeleteQuestion}
                        disabled={loading}
                    >
                        {loading ? "O‘chirilmoqda..." : "Ha, o‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
