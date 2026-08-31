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
import { cn } from "@/lib/utils";

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
        } catch {
            toast.error("Có lỗi xảy ra khi xóa");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-hidden border border-border bg-card">
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="pf-mono h-10 w-[300px] pl-4 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Tên danh mục</TableHead>
                        <TableHead className="pf-mono h-10 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Loại phân loại</TableHead>
                        <TableHead className="pf-mono h-10 pr-4 text-right text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="pf-mono h-28 text-center text-xs tracking-[0.1em] text-muted-foreground uppercase">
                                Chưa có danh mục nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id} className="hover:bg-muted/40 transition-colors">
                                <TableCell className="py-3 pl-4 text-sm text-foreground">{category.name}</TableCell>
                                <TableCell>
                                    {/* Chip tự viết chứ không dùng Badge: cva của Badge có rounded-full và
                                        variant mặc định nền vàng đặc, sẽ phá Luật một nguồn sáng. */}
                                    <span
                                        className={cn(
                                            "pf-mono inline-flex items-center border px-2 py-0.5 text-[11px] tracking-[0.1em] uppercase",
                                            category.type === 'INCOME'
                                                ? "border-(--pf-ok) text-(--pf-ok-ink)"
                                                : "border-(--pf-expense) text-(--pf-expense-ink)"
                                        )}
                                    >
                                        {category.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                                    </span>
                                </TableCell>
                                <TableCell className="pr-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(category)}
                                            aria-label="Sửa danh mục"
                                            className="size-11 rounded-sm text-muted-foreground hover:text-(--pf-expense-ink) sm:size-9"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Xóa danh mục"
                                                    className="size-11 rounded-sm text-muted-foreground hover:text-(--pf-over-ink) sm:size-9"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Hành động này không thể hoàn tác. Danh mục <span className="font-semibold text-foreground">&quot;{category.name}&quot;</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                                        <br /><br />
                                                        Lưu ý: Không thể xóa danh mục nếu đã có giao dịch gắn với nó.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                    <AlertDialogAction variant="destructive"
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
