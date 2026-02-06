import Archive from "../Components/Archive";
import Dashboard from "../Components/Dashboard";
import Create from "../Components/Question/Create";
import Quiz from "../Components/Quiz";
import QuizDetail from "../Components/QuizDetail";

export const AdminRoutes = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: <Dashboard />
    },
    {
        name: 'Quiz',
        path: '/quiz',
        component: <Quiz />
    },
    {
        name: 'Quiz detail',
        path: '/quiz/:id',
        component: <QuizDetail />
    },
    {
        name: 'Question yaratish',
        path: '/question/create/:id',
        component: <Create />
    },
    {
        name: 'Archive',
        path: '/archive',
        component: <Archive />
    },
]