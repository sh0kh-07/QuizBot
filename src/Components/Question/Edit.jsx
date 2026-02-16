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
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { useParams } from "react-router-dom";
import { Alert } from "../../utils/Alert";

export default function Edit({ data, refresh }) {
    const { id: quizId } = useParams();

    // URL для изображений (замените на ваш)
    const IMAGE_BASE_URL = "https://dev.menejment2.uz/";

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);

    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        if (data?.question) {
            setQuestion(data.question);
        }
        if (data?.image) {
            setExistingImage(data.image);
            setImagePreview(`${IMAGE_BASE_URL}${data.image}`);
        } else {
            setExistingImage(null);
            setImagePreview(null);
        }
    }, [data]);

    // Обработчик выбора изображения
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                Alert("Faqat rasm yuklash mumkin", "warning");
                return;
            }

            // Проверка размера (макс 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Alert("Rasm hajmi 5MB dan oshmasligi kerak", "warning");
                return;
            }

            setImage(file);
            setRemoveImage(false);

            // Создаем превью
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Удаление изображения
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        setExistingImage(null);
        setRemoveImage(true);
    };

    const EditQuestion = async () => {
        if (!question.trim()) {
            Alert("Savol matnini kiriting", "warning");
            return;
        }

        try {
            setLoading(true);

            // Создаем FormData для отправки файла
            const formData = new FormData();
            formData.append("quizId", quizId);
            formData.append("question", question);

            // Если выбрано новое изображение
            if (image) {
                formData.append("image", image);
            }

            // Если нужно удалить существующее изображение
            if (removeImage) {
                formData.append("removeImage", "true");
            }

            await QuestionApi.Edit(data.id, formData);

            Alert("Savol muvaffaqiyatli yangilandi", "success");
            refresh?.();
            setOpen(false);

            // Сброс состояния
            setImage(null);
            setRemoveImage(false);
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
                <svg className="text-white h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z" />
                </svg>
            </Button>

            {/* MODAL */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5">
                        Savolni tahrirlash
                    </Typography>
                </DialogHeader>

                <DialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Savol matni */}
                    <div>
                        <Input
                            label="Savol matni"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What is JavaScript?"
                        />
                    </div>

                    {/* Изображение */}
                    <div className="space-y-3">
                        <Typography className="text-sm font-medium text-gray-700">
                            Rasm (ixtiyoriy)
                        </Typography>

                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                    <Typography className="text-sm text-gray-600 mb-1">
                                        Rasmni yuklash uchun bosing
                                    </Typography>
                                    <Typography className="text-xs text-gray-400">
                                        PNG, JPG, GIF (max 5MB)
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="relative border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    {/* Превью изображения */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = '';
                                                e.target.alt = 'Rasm yuklanmadi';
                                            }}
                                        />
                                    </div>

                                    {/* Информация о файле */}
                                    <div className="flex-1 min-w-0">
                                        <Typography className="text-sm font-medium text-gray-700 truncate">
                                            {image?.name || existingImage || 'Mavjud rasm'}
                                        </Typography>
                                        {image && (
                                            <Typography className="text-xs text-gray-500 mt-1">
                                                {(image.size / 1024).toFixed(2)} KB
                                            </Typography>
                                        )}

                                        {/* Кнопки */}
                                        <div className="flex items-center gap-2 mt-3">
                                            {/* Заменить изображение */}
                                            <label className="cursor-pointer">
                                                <div className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                                                    <Upload className="w-3 h-3" />
                                                    Almashtirish
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>

                                            {/* Удалить изображение */}
                                            <button
                                                onClick={handleRemoveImage}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                                O'chirish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Подсказка */}
                        <Typography className="text-xs text-gray-500 italic">
                            💡 Agar rasmni o'zgartirmasangiz, avvalgi rasm saqlanadi
                        </Typography>
                    </div>
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