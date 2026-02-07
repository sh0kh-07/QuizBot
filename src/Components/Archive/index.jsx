import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button, Select, Option } from "@material-tailwind/react";
import { Calendar, Clock, Eye, FileText, Filter } from "lucide-react";
import { QuizApi } from "../../utils/Controllers/QuizApi";
import EmptyData from "../UI/NoData/EmptyData";
import Loading from "../UI/Loadings/Loading";
import Create from "../Quiz/__components/Create";
import Delete from "../Quiz/__components/Delete";
import Edit from "../Quiz/__components/Edit";
import { NavLink } from "react-router-dom";
import Send from "../Quiz/__components/Send";
import DownLaod from "../Quiz/__components/DownLoad";

export default function Archive() {
    const [quizzes, setQuizzes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filterPeriod, setFilterPeriod] = useState("all");

    // Функция для форматирования даты в YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Функция для расчета дат
    const getDateRange = (period) => {
        const now = new Date();
        let startDate = null;
        let endDate = formatDate(now); // Текущая дата

        switch (period) {
            case "week":
                // Неделя назад
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                startDate = formatDate(weekAgo);
                break;
            case "month":
                // Месяц назад
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                startDate = formatDate(monthAgo);
                break;
            case "3months":
                // 3 месяца назад
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                startDate = formatDate(threeMonthsAgo);
                break;
            case "year":
                // Год назад
                const yearAgo = new Date();
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                startDate = formatDate(yearAgo);
                break;
            default:
                // Все время
                return { startDate: null, endDate: null };
        }

        return { startDate, endDate };
    };

    const fetchQuizzes = async (page = 1, period = filterPeriod) => {
        try {
            setLoading(true);

            const { startDate, endDate } = getDateRange(period);

            // Формируем объект с параметрами
            const params = {
                page,
                ...(startDate && { startDate }), // Добавляем только если startDate существует
                ...(endDate && { endDate }),     // Добавляем только если endDate существует
            };

            console.log("Sending params:", params); // Для отладки

            const res = await QuizApi.GetStartDate_EndDate(params);
            console.log("API Response:", res?.data); // Для отладки

            setQuizzes(res?.data?.data?.records || []);
            setCurrentPage(Number(res?.data?.data?.pagination?.currentPage || 1));
            setTotalPages(Number(res?.data?.data?.pagination?.totalPages || 1));
        } catch (err) {
            console.log("Ошибка при загрузке квизов:", err);
            setQuizzes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes(1);
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchQuizzes(page);
    };

    const handleFilterChange = (value) => {
        setFilterPeriod(value);
        setCurrentPage(1);
        fetchQuizzes(1, value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <Typography variant="h4" className="text-gray-800">
                    Quizlar
                </Typography>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Фильтр по периоду */}
                    <div className="flex-1 sm:flex-none sm:w-48">
                        <Select
                            label="Davr bo'yicha"
                            value={filterPeriod}
                            onChange={(value) => handleFilterChange(value)}
                            className="bg-white"
                        >
                            <Option value="all">Barchasi</Option>
                            <Option value="week">Oxirgi hafta</Option>
                            <Option value="month">Oxirgi oy</Option>
                            <Option value="3months">Oxirgi 3 oy</Option>
                            <Option value="year">Oxirgi yil</Option>
                        </Select>
                    </div>

                    {/* Кнопка создания */}
                    <Create refresh={() => fetchQuizzes(currentPage, filterPeriod)} />
                </div>
            </div>

            {/* Информация о выбранном фильтре */}
            {filterPeriod !== "all" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <Typography className="text-sm text-blue-700">
                        Ko'rsatilmoqda:{" "}
                        {filterPeriod === "week" && "Oxirgi hafta"}
                        {filterPeriod === "month" && "Oxirgi oy"}
                        {filterPeriod === "3months" && "Oxirgi 3 oy"}
                        {filterPeriod === "year" && "Oxirgi yil"}
                    </Typography>
                    <button
                        onClick={() => handleFilterChange("all")}
                        className="ml-auto text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                        Tozalash
                    </button>
                </div>
            )}

            {/* Список карточек */}
            {quizzes.length === 0 ? (
                <EmptyData text={filterPeriod !== "all" ? "Tanlangan davrda ma'lumot yo'q" : "Ma'lumot yo'q"} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition"
                        >
                            <CardBody className="flex flex-col gap-3">
                                <Typography variant="h6" className="font-medium text-gray-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    {quiz.name}
                                </Typography>

                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{quiz.time} daqiqa</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{quiz.count} savol</span>
                                    </div>
                                </div>

                                <Typography className="text-gray-500 text-xs mt-2">
                                    Turi: {quiz?.type}
                                </Typography>
                                <Typography className="text-gray-500 text-xs">
                                    Yaratilgan: {new Date(quiz.createdAt).toLocaleDateString("uz-UZ")}
                                </Typography>

                                <div className="grid grid-cols-2 gap-[10px]">
                                    <NavLink to={`/quiz/${quiz?.id}`}>
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 w-full hover:bg-blue-600 text-white flex items-center justify-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" /> Ko'rish
                                        </Button>
                                    </NavLink>
                                    <Delete refresh={() => fetchQuizzes(currentPage, filterPeriod)} id={quiz?.id} />
                                    <Edit refresh={() => fetchQuizzes(currentPage, filterPeriod)} data={quiz} />
                                    <Send quizId={quiz?.id} />
                                    <DownLaod quizId={quiz?.id} />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i + 1}
                            size="sm"
                            variant={currentPage === i + 1 ? "filled" : "outlined"}
                            color={currentPage === i + 1 ? "blue" : "gray"}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}