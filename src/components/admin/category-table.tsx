"use client";

import { Category } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSystemCategory } from "@/actions/admin";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const result = await deleteSystemCategory(id);
            if (result.success) {
                toast.success("Đã xóa danh mục thành công");
            } else {
                toast.error(result.error || "Không thể xóa danh mục");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[300px] pl-6 font-semibold">Tên danh mục</TableHead>
                        <TableHead className="font-semibold">Loại phân loại</TableHead>
                        <TableHead className="text-right pr-6 font-semibold">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-32 text-muted-foreground">
                                Chưa có danh mục nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id} className="hover:bg-muted/40 transition-colors">
                                <TableCell className="font-medium text-base py-4 pl-6">{category.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`px-4 py-1 rounded-full text-sm font-medium border-0 shadow-sm ${category.type === 'INCOME'
                                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                : 'bg-rose-500 hover:bg-rose-600 text-white'
                                            }`}
                                    >
                                        {category.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này không thể hoàn tác. Danh mục <span className="font-semibold text-foreground">"{category.name}"</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                                        <br /><br />
                                                        Lưu ý: Không thể xóa danh mục nếu đã có giao dịch gắn với nó.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={() => handleDelete(category.id)}
                                                        disabled={deletingId === category.id}
                                                    >
                                                        {deletingId === category.id ? "Đang xóa..." : "Xóa danh mục"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
