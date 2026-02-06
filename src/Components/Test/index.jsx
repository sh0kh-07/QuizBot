import { useEffect, useState } from "react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { UserAnswer } from "../../utils/Controllers/UserAnswer";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Button, Progress } from "@material-tailwind/react";
import { Clock, CheckCircle, XCircle, AlertCircle, Home } from "lucide-react";
import Swal from "sweetalert2";
import Loading from "../UI/Loadings/Loading";
import { Alert } from "../../utils/Alert";

export default function Test() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [testFinished, setTestFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quizInfo, setQuizInfo] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [startTime, setStartTime] = useState(null);
    const [userQuizId, setUserQuizId] = useState(null);

    const GetAllQuiz = async () => {
        try {
            const response = await QuestionApi.GetAll(id);
            const data = response?.data || [];
            setQuestions(data);

            if (data.length > 0) {
                setQuizInfo(data[0].quiz);
                setTimeLeft(data[0].quiz.time * 60);
                setStartTime(Date.now());
                setUserQuizId(id);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Xatolik",
                text: "Testni yuklashda xatolik yuz berdi",
                confirmButtonText: "Orqaga",
            }).then(() => {
                navigate(-1);
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllQuiz();
    }, []);

    useEffect(() => {
        if (loading || timeLeft <= 0 || testFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, timeLeft, testFinished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerSelect = (questionId, optionId) => {
        if (answeredQuestions.has(questionId)) return;

        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        setAnsweredQuestions((prev) => new Set([...prev, questionId]));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const PostAnswer = async () => {
        try {
            const chatId = localStorage.getItem("telegramChatId");
            const endTimeMinutes = Math.round((Date.now() - startTime) / 1000 / 60);

            const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
                userQuizId: userQuizId,
                questionId: questionId,
                optionId: optionId,
                note: ""
            }));

            const data = {
                chatId: chatId,
                quizId: id,
                endTime: endTimeMinutes,
                answers: answers
            };
            const response = await UserAnswer.Create(data);
            Alert('Yaxshi', "success")
            return response;
        } catch (error) {
            Alert('Error', "error")
            console.error("Javoblarni yuborishda xatolik:", error);
        }
    };
    const handleSubmit = async (autoSubmit = false) => {
        const answeredCount = Object.keys(selectedAnswers).length;

        if (!autoSubmit && answeredCount < questions.length) {
            Swal.fire({
                title: "Diqqat!",
                text: `Siz ${questions.length - answeredCount} ta savolga javob bermadingiz. Testni yakunlamoqchimisiz?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ha, yakunlash",
                cancelButtonText: "Yo'q, davom etish",
                confirmButtonColor: "#ef4444",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await PostAnswer();
                    setTestFinished(true);
                }
            });
        } else {
            await PostAnswer();
            setTestFinished(true);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;

        questions.forEach((question) => {
            const selectedOptionId = selectedAnswers[question.id];
            const correctOption = question.options.find((opt) => opt.isCorrect);

            if (selectedOptionId === correctOption?.id) {
                correctCount++;
            }
        });

        return {
            correct: correctCount,
            incorrect: Object.keys(selectedAnswers).length - correctCount,
            unanswered: questions.length - Object.keys(selectedAnswers).length,
            percentage: ((correctCount / questions.length) * 100).toFixed(1)
        };
    };

    if (loading) return <Loading />;

    // Результаты
    if (testFinished) {
        const results = calculateResults();

        return (
            <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
                <div className="max-w-3xl mx-auto">
                    {/* Заголовок */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                        <Typography variant="h4" className="font-bold text-gray-800 text-center mb-2">
                            Test yakunlandi
                        </Typography>
                        <Typography className="text-gray-600 text-center text-sm sm:text-base">
                            {quizInfo?.name}
                        </Typography>
                    </div>

                    {/* Статистика */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                                {results.percentage}%
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Natija</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                                {results.correct}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">To'g'ri</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                                {results.incorrect}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Noto'g'ri</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-gray-600 mb-1">
                                {results.unanswered}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Javobsiz</div>
                        </div>
                    </div>

                    {/* Детальные результаты */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                            Batafsil natijalar
                        </Typography>

                        <div className="space-y-4">
                            {questions.map((question, index) => {
                                const selectedOptionId = selectedAnswers[question.id];
                                const correctOption = question.options.find((opt) => opt.isCorrect);
                                const isCorrect = selectedOptionId === correctOption?.id;
                                const isAnswered = selectedOptionId !== undefined;

                                return (
                                    <div key={question.id} className="border-l-4 pl-3 py-2" style={{
                                        borderColor: !isAnswered ? '#d1d5db' : isCorrect ? '#10b981' : '#ef4444'
                                    }}>
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {!isAnswered ? (
                                                    <AlertCircle className="w-5 h-5 text-gray-400" />
                                                ) : isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <Typography className="font-medium text-gray-800 text-sm sm:text-base flex-1">
                                                {index + 1}. {question.question}
                                            </Typography>
                                        </div>

                                        <div className="ml-7 space-y-2">
                                            {question.options.map((option) => {
                                                const isSelected = selectedOptionId === option.id;
                                                const isCorrectAnswer = option.isCorrect;

                                                return (
                                                    <div key={option.id} className="text-sm">
                                                        {isCorrectAnswer && (
                                                            <div className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                                <div className="flex-1">
                                                                    <div className="text-green-800 font-medium">
                                                                        {option.text}
                                                                    </div>
                                                                    {option.note && (
                                                                        <div className="text-green-700 text-xs mt-1 italic">
                                                                            💡 {option.note}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isSelected && !isCorrectAnswer && (
                                                            <div className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                                                                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                                <div className="text-red-800">
                                                                    {option.text}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Кнопка */}
               
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const timePercentage = (timeLeft / (quizInfo?.time * 60)) * 100;
    const isQuestionAnswered = answeredQuestions.has(currentQ?.id);
    const selectedOptionId = selectedAnswers[currentQ?.id];

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 pb-20">
            <div className="max-w-3xl mx-auto">
                {/* Хедер с таймером */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-3">
                        <Typography variant="h6" className="font-semibold text-gray-800 text-sm sm:text-base truncate pr-2">
                            {quizInfo?.name}
                        </Typography>
                        <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex-shrink-0 ${timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                            }`}>
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-mono font-bold text-base sm:text-lg">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                            <span>Savol {currentQuestion + 1} / {questions.length}</span>
                            <span>{Object.keys(selectedAnswers).length} javob</span>
                        </div>
                        <Progress value={progress} color="blue" className="h-2" />
                        <Progress value={timePercentage} color={timeLeft < 60 ? "red" : "green"} className="h-1" />
                    </div>
                </div>

                {/* Вопрос */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                    <Typography variant="h6" className="mb-4 text-gray-800 font-medium text-base sm:text-lg">
                        {currentQ?.question}
                    </Typography>

                    <div className="space-y-2 sm:space-y-3">
                        {currentQ?.options.map((option, index) => {
                            const isSelected = selectedOptionId === option.id;
                            const isCorrect = option.isCorrect;
                            const showResult = isQuestionAnswered;

                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${!showResult
                                        ? "cursor-pointer border-gray-200 hover:border-gray-300 active:border-gray-400 bg-white"
                                        : isCorrect
                                            ? "border-green-500 bg-green-50"
                                            : isSelected
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 bg-gray-50"
                                        } ${!showResult && isSelected ? "border-blue-500 bg-blue-50" : ""}`}
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {showResult ? (
                                                isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                ) : isSelected ? (
                                                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300" />
                                                )
                                            ) : (
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                                    }`}>
                                                    {isSelected && (
                                                        <div className="w-full h-full rounded-full bg-white scale-50" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Typography className={`text-sm sm:text-base ${showResult && isCorrect ? "font-semibold text-green-800" :
                                                showResult && isSelected ? "font-semibold text-red-800" :
                                                    "text-gray-800"
                                                }`}>
                                                <span className="font-semibold mr-1 sm:mr-2">
                                                    {String.fromCharCode(65 + index)}.
                                                </span>
                                                {option.text}
                                            </Typography>

                                            {showResult && isCorrect && option.note && (
                                                <Typography className="text-xs sm:text-sm text-green-700 mt-2 p-2 bg-green-100 rounded italic">
                                                    💡 {option.note}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Навигация */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4">
                    <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
                        <Button
                            onClick={handlePrev}
                            disabled={currentQuestion === 0}
                            variant="outlined"
                            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                            color="blue-gray"
                        >
                            Orqaga
                        </Button>

                        {currentQuestion === questions.length - 1 ? (
                            <Button
                                onClick={() => handleSubmit(false)}
                                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                                color="green"
                            >
                                Yakunlash
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                                color="blue"
                            >
                                Keyingi
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}