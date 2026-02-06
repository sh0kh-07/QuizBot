import { NavLink, useParams } from "react-router-dom";
import { QuizApi } from "../../utils/Controllers/QuizApi";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { useEffect, useState } from "react";
import Loading from "../UI/Loadings/Loading";
import {
    Button,
    Card,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import Info from "./__compoenents/Info";
import Edit from "../Question/Edit";
import OptionEdit from "./__compoenents/OptionEdit";
import Delete from "../Question/Delete";
import OptionDelete from "./__compoenents/OptionDelete";
import EmptyData from "../UI/NoData/EmptyData";

export default function QuizDetail() {
    const { id } = useParams();

    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const getQuiz = async () => {
        try {
            const res = await QuizApi.GetById(id);
            setQuiz(res?.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getQuestions = async (pageNum = 1) => {
        try {
            const res = await QuestionApi.Get(id, pageNum);
            setQuestions(res?.data?.data?.records || []);
            setPagination(res?.data?.data?.pagination || {});
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([getQuiz(), getQuestions(page)])
            .finally(() => setLoading(false));
    }, [page]);

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            {/* QUIZ INFO */}
            {/* <Info data={quiz} /> */}

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <Typography variant="h4">Savollar</Typography>
                <NavLink to={`/question/create/${id}`}>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                         +
                    </Button>
                </NavLink>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-4">

                {questions?.length > 0 ? (
                    questions.map((q, index) => (
                        <Card key={q.id} className="border">
                            <CardBody className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <Typography className="font-semibold">
                                        {index + 1}. {q.question}
                                    </Typography>
                                    <div className="flex items-center gap-[10px]">
                                        <Edit data={q} refresh={getQuestions} />
                                        <Delete id={q?.id} refresh={getQuestions} />
                                    </div>
                                </div>

                                {/* OPTIONS */}
                                <div className="flex items-start gap-[10px] flex-col w-full">
                                    {q.options.map((opt, index) => (
                                        <div
                                            key={opt.id}
                                            className={`p-3 rounded-lg border w-full ${opt.isCorrect
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p>
                                                    {index + 1} Variant
                                                </p>
                                                <div className="flex items-center gap-[10px]">
                                                    <OptionEdit refresh={getQuestions} data={opt} />
                                                    <OptionDelete refresh={getQuestions} id={opt?.id} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Typography>
                                                    {opt.text}
                                                </Typography>

                                            </div>

                                            {opt.isCorrect && opt.note && (
                                                <Typography
                                                    variant="small"
                                                    className="mt-2 text-gray-600"
                                                >
                                                    {opt.note}
                                                </Typography>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <EmptyData text={'Savollar mavjud emas'} />
                )}


            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Oldingi
                    </Button>

                    <Typography variant="small">
                        {pagination.currentPage} / {pagination.totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Keyingi
                    </Button>
                </div>
            )}
        </div>
    );
}
