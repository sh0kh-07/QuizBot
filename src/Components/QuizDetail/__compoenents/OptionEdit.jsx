import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Typography,
} from "@material-tailwind/react";
import { OptionApi } from "../../../utils/Controllers/OptionApi";
import { Alert } from "../../../utils/Alert";

export default function OptionEdit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [text, setText] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [note, setNote] = useState("");

    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        if (data) {
            setText(data.text || "");
            setIsCorrect(!!data.isCorrect);
            setNote(data.note || "");
        }
    }, [data]);

    const EditOption = async () => {
        if (!text.trim()) {
            Alert("Javob matnini kiriting", "warning");
            return;
        }

        if (isCorrect && !note.trim()) {
            Alert("To‘g‘ri javob uchun izoh yozing", "warning");
            return;
        }

        try {
            setLoading(true);

            await OptionApi.Edit(data.id, {
                text,
                isCorrect,
                note, // всегда отправляем
            });

            Alert("Variant muvaffaqiyatli yangilandi", "success");
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
                <svg
                    className="text-white h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
                    />
                </svg>
            </Button>

            {/* MODAL */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5">
                        Variantni tahrirlash
                    </Typography>
                </DialogHeader>

                <DialogBody className="space-y-4">
                    <Input
                        label="Javob matni"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    {/* Checkbox */}
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={isCorrect}
                            onChange={(e) => setIsCorrect(e.target.checked)}
                        />
                        To‘g‘ri javob
                    </label>

                    {/* NOTE — только если правильный */}
                    {isCorrect && (
                        <Textarea
                            label="Izoh (nega to‘g‘ri)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                        />
                    )}
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
                        onClick={EditOption}
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
