import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Checkbox,
} from "@material-tailwind/react";
import { Groups } from "../../../utils/Controllers/Groups";
import { Alert } from "../../../utils/Alert";
import { Send as SendIcon } from "lucide-react";

export default function Send({ quizId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    const handleOpen = () => setOpen(!open);

    const getAllGr = async () => {
        try {
            const response = await Groups.Get();
            setGroups(response?.data || []);
        } catch (error) {
            console.log(error);
            Alert("Guruhlarni yuklashda xatolik", "error");
        }
    };

    useEffect(() => {
        if (open) {
            getAllGr();
        }
    }, [open]);

    const handleGroupToggle = (groupId) => {
        setSelectedGroups((prev) => {
            if (prev.includes(groupId)) {
                return prev.filter((id) => id !== groupId);
            } else {
                return [...prev, groupId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedGroups.length === groups.length) {
            setSelectedGroups([]);
        } else {
            setSelectedGroups(groups.map((group) => group.id));
        }
    };

    const handleSend = async () => {
        if (selectedGroups.length === 0) {
            Alert("Kamida bitta guruhni tanlang", "warning");
            return;
        }

        try {
            setLoading(true);

            const data = {
                quizId: quizId,
                url: `/test/${quizId}`,
                groups: selectedGroups.map((groupId) => ({
                    groupId: groupId,
                })),
            };

            await Groups.Send(data);

            Alert("Quiz muvaffaqiyatli yuborildi!", "success");
            setSelectedGroups([]);
            setOpen(false);
        } catch (error) {
            console.log(error);
            Alert(
                error?.response?.data?.message || "Yuborishda xatolik",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Кнопка открытия */}
            <Button
                size="sm"
                onClick={handleOpen}
                className="bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
            >
                <SendIcon className="w-4 h-4" />
                Jo'natish
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5">
                        Quizni guruhlarga jo'natish
                    </Typography>
                </DialogHeader>

                <DialogBody className="max-h-[60vh] overflow-y-auto">
                    {groups.length === 0 ? (
                        <div className="text-center py-8">
                            <Typography className="text-gray-600">
                                Guruhlar topilmadi
                            </Typography>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Выбрать все */}
                            <div className="border-b pb-3">
                                <Checkbox
                                    label={
                                        <Typography className="font-medium">
                                            Hammasini tanlash ({selectedGroups.length}/{groups.length})
                                        </Typography>
                                    }
                                    checked={selectedGroups.length === groups.length && groups.length > 0}
                                    onChange={handleSelectAll}
                                    color="blue"
                                />
                            </div>

                            {/* Список групп */}
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedGroups.includes(group.id)
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => handleGroupToggle(group.id)}
                                >
                                    <Checkbox
                                        checked={selectedGroups.includes(group.id)}
                                        onChange={() => handleGroupToggle(group.id)}
                                        label={
                                            <div>
                                                <Typography className="font-medium text-gray-800">
                                                    {group.name}
                                                </Typography>
                                                <Typography className="text-xs text-gray-500">
                                                    {group.type} • {new Date(group.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </div>
                                        }
                                        color="blue"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                        disabled={loading}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        onClick={handleSend}
                        disabled={loading || selectedGroups.length === 0}
                        className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                    >
                        {loading ? (
                            "Jo'natilmoqda..."
                        ) : (
                            <>
                                <SendIcon className="w-4 h-4" />
                                Jo'natish ({selectedGroups.length})
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}