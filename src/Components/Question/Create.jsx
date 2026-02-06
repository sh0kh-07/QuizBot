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
import { Plus, Trash2 } from "lucide-react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { Alert } from "../../utils/Alert";
import { useParams } from "react-router-dom";

export default function CreateQuestion({ refresh }) {
    const { id } = useParams();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async () => {
        if (!question.trim()) {
            Alert("Savolni kiriting", "warning");
            return;
        }

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

            const payload = {
                quizId: id,
                question,
                options: options.map(o => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                    note: o.note || "",
                })),
            };

            await QuestionApi.Create(payload);
            Alert("Savol muvaffaqiyatli yaratildi!", "success");

            setQuestion("");
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

                {/* Javoblar */}
                <div className="space-y-3">
                    {options.map((opt, index) => (
                        <div
                            key={opt.id}
                            className={`border rounded-lg p-3 sm:p-4 ${opt.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
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
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                        className="bg-blue-500 hover:bg-blue-600 w-full sm:flex-1 text-sm sm:text-base"
                        size="sm"
                    >
                        {loading ? "Saqlanmoqda..." : "Savol yaratish"}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}