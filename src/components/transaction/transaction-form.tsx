"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { updateTransaction, createTransaction } from "@/actions/transaction";
import { Category, Transaction } from "@prisma/client";

const formSchema = z.object({
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  description: z.string().min(1, "Vui lòng nhập ghi chú"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.date(),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  categories: Category[];
  initialData?: Transaction | null;
  onSuccess: () => void;
}

export function TransactionForm({ categories, initialData, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      type: "EXPENSE",
      categoryId: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: Number(initialData.amount),
        description: initialData.description,
        type: initialData.type as "INCOME" | "EXPENSE",
        categoryId: initialData.categoryId,
        date: new Date(initialData.date),
      });
    }
  }, [initialData, form]);

  const filteredCategories = categories.filter((c) => c.type === "EXPENSE");

  async function onSubmit(values: TransactionFormValues) {
    setLoading(true);
    let result;

    if (initialData) {
      result = await updateTransaction(initialData.id, values);
    } else {
      result = await createTransaction(values);
    }

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(initialData ? "Đã cập nhật chi tiêu!" : "Đã thêm chi tiêu!");
      if (!initialData) {
        form.reset();
      }
      onSuccess();
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Hidden Type Field - Defaulting to EXPENSE */}
        <div className="hidden">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <Input {...field} value="EXPENSE" type="hidden" />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    value={field.value as number}
                    placeholder="0"
                    type="number"
                    min="0"
                    className="pl-8 text-lg font-bold"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Ăn trưa, Tiền xăng..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal cursor-pointer flex items-center gap-1"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {showDatePicker ? "Ẩn chọn ngày" : "Chọn ngày khác / Tùy chọn"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", showDatePicker && "rotate-180")} />
          </Button>
        </div>

        {showDatePicker && (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col animate-in fade-in slide-in-from-top-2">
                <FormLabel>Ngày</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: vi })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang lưu..." : (initialData ? "Cập nhật" : "Lưu chi tiêu")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
