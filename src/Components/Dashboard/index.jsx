import { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FileQuestion, Users, CheckCircle, Target } from "lucide-react";
import EmptyData from "../UI/NoData/EmptyData";
import Loading from "../UI/Loadings/Loading";
// import { DashboardApi } from "../../utils/Controllers/DashboardApi"; // импортируйте ваш API

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        totalUsers: 0,
        completedTests: 0,
        totalAttempts: 0
    });

    const getStats = async () => {
        try {
            setLoading(true);
            // const response = await DashboardApi.GetStats();
            // setStats(response?.data || {});

            // Временные данные для примера
            setStats({
                totalQuizzes: 45,
                totalUsers: 1234,
                completedTests: 567,
                totalAttempts: 892
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    const statsCards = [
        {
            title: "Yaratilgan testlar",
            value: stats.totalQuizzes,
            icon: FileQuestion,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Ro'yxatdan o'tganlar",
            value: stats.totalUsers,
            icon: Users,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            title: "Yakunlangan testlar",
            value: stats.completedTests,
            icon: CheckCircle,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            title: "Jami urinishlar",
            value: stats.totalAttempts,
            icon: Target,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600"
        }
    ];

    if (loading) return <Loading />;

    return (
        <div className="p-1 sm:p-2 space-y-6">
            {/* Header */}
            <div className="mb-6">
                <Typography variant="h4" className="font-bold text-gray-800">
                    Dashboard
                </Typography>
                <Typography className="text-gray-600 text-sm mt-1">
                    Statistika va umumiy ma'lumotlar
                </Typography>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <Card
                        key={index}
                        className="shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>

                            <div>
                                <Typography variant="h3" className="font-bold text-gray-800 mb-1">
                                    {stat.value.toLocaleString()}
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    {stat.title}
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Additional Info Card */}
            <Card className="shadow-md border border-gray-100">
                <CardBody className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <FileQuestion className="w-5 h-5 text-blue-600" />
                        </div>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                            Tizim haqida
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Faol testlar:</span>
                            <span className="font-medium text-gray-800">{stats.totalQuizzes}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Umumiy foydalanuvchilar:</span>
                            <span className="font-medium text-gray-800">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">O'rtacha urinishlar:</span>
                            <span className="font-medium text-gray-800">
                                {stats.totalUsers > 0
                                    ? (stats.totalAttempts / stats.totalUsers).toFixed(1)
                                    : 0}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Yakunlanish foizi:</span>
                            <span className="font-medium text-gray-800">
                                {stats.totalAttempts > 0
                                    ? ((stats.completedTests / stats.totalAttempts) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}