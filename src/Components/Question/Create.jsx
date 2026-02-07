import { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Typography,
    Checkbox,
} from "@material-tailwind/react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { Alert } from "../../utils/Alert";
import { NavLink, useParams } from "react-router-dom";

export default function CreateQuestion({ refresh }) {
    const { id } = useParams();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [options, setOptions] = useState([
        {
            id: crypto.randomUUID(),
            text: "",
            isCorrect: false,
            note: "",
        },
    ]);

    const handleOptionChange = (id, key, value) => {
        setOptions(prev =>
            prev.map(opt =>
                opt.id === id ? { ...opt, [key]: value } : opt
            )
        );
    };

    const addOption = () => {
        setOptions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                text: "",
                isCorrect: false,
                note: "",
            },
        ]);
    };

    const removeOption = (id) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

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
    };

    const handleSubmit = async () => {


        if (options.some(o => !o.text.trim())) {
            Alert("Barcha javoblarni to'ldiring", "warning");
            return;
        }

        if (!options.some(o => o.isCorrect)) {
            Alert("Kamida bitta to'g'ri javob tanlang", "warning");
            return;
        }

        try {
            setLoading(true);

            // Создаем FormData для отправки файла
            const formData = new FormData();
            formData.append("quizId", id);
            formData.append("question", question);

            // Добавляем изображение, если оно есть
            if (image) {
                formData.append("image", image);
            }

            // Добавляем опции как JSON строку
            formData.append("options", JSON.stringify(
                options.map(o => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                    note: o.note || "",
                }))
            ));

            await QuestionApi.Create(formData);
            Alert("Savol muvaffaqiyatli yaratildi!", "success");

            // Сброс формы
            setQuestion("");
            setImage(null);
            setImagePreview(null);
            setOptions([
                {
                    id: crypto.randomUUID(),
                    text: "",
                    isCorrect: false,
                    note: "",
                },
            ]);

            refresh?.();
        } catch (err) {
            console.log(err);
            Alert("Xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border shadow-sm rounded-xl">
            <CardBody className="flex flex-col gap-4 p-4 sm:p-6">
                <Typography variant="h5" className="text-lg sm:text-xl">
                    Yangi savol yaratish
                </Typography>

                {/* Savol */}
                <Textarea
                    label="Savol"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    className="text-sm sm:text-base"
                />

                {/* Загрузка изображения */}
                <div className="space-y-3">
                    <Typography className="text-sm font-medium text-gray-700">
                        Rasm qo'shish (ixtiyoriy)
                    </Typography>

                    {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-400 transition-colors">
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
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
                        <div className="relative border border-gray-200 rounded-lg p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                                {/* Превью изображения */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>

                                {/* Информация о файле */}
                                <div className="flex-1 min-w-0">
                                    <Typography className="text-sm font-medium text-gray-700 truncate">
                                        {image?.name}
                                    </Typography>
                                    <Typography className="text-xs text-gray-500 mt-1">
                                        {(image?.size / 1024).toFixed(2)} KB
                                    </Typography>

                                    {/* Кнопка удаления */}
                                    <Button
                                        variant="text"
                                        color="red"
                                        size="sm"
                                        onClick={handleRemoveImage}
                                        className="mt-2 p-2 flex items-center gap-1 text-xs"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        O'chirish
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Javoblar */}
                <div className="space-y-3">
                    <Typography className="text-sm font-medium text-gray-700">
                        Javoblar
                    </Typography>

                    {options.map((opt, index) => (
                        <div
                            key={opt.id}
                            className={`border rounded-lg p-3 sm:p-4 transition-colors ${opt.isCorrect
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            {/* Заголовок варианта */}
                            <div className="flex items-center justify-between mb-3">
                                <Typography className="text-sm font-medium text-gray-700">
                                    Javob {index + 1}
                                </Typography>
                                {options.length > 1 && (
                                    <Button
                                        variant="text"
                                        color="red"
                                        size="sm"
                                        onClick={() => removeOption(opt.id)}
                                        className="p-2 min-w-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Текст ответа */}
                            <Input
                                label="Javob matni"
                                value={opt.text}
                                onChange={(e) =>
                                    handleOptionChange(opt.id, "text", e.target.value)
                                }
                                className="mb-3 text-sm sm:text-base"
                            />

                            {/* Чекбокс правильности */}
                            <div className="flex items-center mb-3">
                                <Checkbox
                                    checked={opt.isCorrect}
                                    onChange={(e) =>
                                        handleOptionChange(opt.id, "isCorrect", e.target.checked)
                                    }
                                    label={
                                        <Typography className="text-sm font-medium">
                                            To'g'ri javob
                                        </Typography>
                                    }
                                    color="green"
                                />
                            </div>

                            {/* Пояснение (только для правильных) */}
                            {opt.isCorrect && (
                                <Textarea
                                    label="Izoh (nega to'g'ri)"
                                    value={opt.note}
                                    onChange={(e) =>
                                        handleOptionChange(opt.id, "note", e.target.value)
                                    }
                                    rows={2}
                                    className="text-sm sm:text-base"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={addOption}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">Yangi javob</span>
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 w-full sm:flex-1 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        size="sm"
                    >
                        {loading ? "Saqlanmoqda..." : "Savol yaratish"}
                    </Button>
                    <NavLink to={`/quiz`}>
                        <Button
                            color="red"
                            className=" w-full sm:flex-1 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            size="sm"
                        >
                            Tugatish
                        </Button>
                    </NavLink>
                </div>
            </CardBody>
        </Card>
    );
}