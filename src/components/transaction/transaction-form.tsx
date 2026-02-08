"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/format-currency";
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
import { Textarea } from "@/components/ui/textarea";
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
import { updateTransaction, createTransaction, TransactionWithCategory } from "@/actions/transaction";
import { Category, Transaction } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  description: z.string().min(1, "Vui lòng nhập ghi chú"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  date: z.date(),
  paymentMethod: z.enum(["CASH", "TRANSFER"]),
  transferCode: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  categories: Category[];
  initialData?: Transaction | TransactionWithCategory | null;
  onSuccess: () => void;
}

export function TransactionForm({ categories, initialData, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      amount: Number(initialData.amount),
      description: initialData.description,
      type: initialData.type as "INCOME" | "EXPENSE",
      categoryId: initialData.categoryId,
      date: new Date(initialData.date),
      paymentMethod: (initialData.paymentMethod as "CASH" | "TRANSFER") || "CASH",
      transferCode: initialData.transferCode || "",
    } : {
      amount: 0,
      description: "",
      type: "EXPENSE",
      categoryId: "",
      date: new Date(),
      paymentMethod: "CASH",
      transferCode: "",
    },
  });

  // Use useWatch to subscription to the value to avoid React Compiler issues
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: Number(initialData.amount),
        description: initialData.description,
        type: initialData.type as "INCOME" | "EXPENSE",
        categoryId: initialData.categoryId,
        date: new Date(initialData.date),
        paymentMethod: (initialData.paymentMethod as "CASH" | "TRANSFER") || "CASH",
        transferCode: initialData.transferCode || "",
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
                    value={field.value ? formatNumber(field.value as number) : ""}
                    onChange={(e) => {
                      // Remove non-digits (keep only numbers)
                      const rawValue = e.target.value.replace(/\D/g, "");
                      const numberValue = Number(rawValue);
                      field.onChange(numberValue);
                    }}
                    placeholder="0"
                    type="text"
                    inputMode="numeric"
                    className="pl-8 text-lg font-bold"
                    disabled={loading}
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
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={loading}>
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
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Hình thức thanh toán</FormLabel>
              <FormControl>
                <Tabs onValueChange={field.onChange} value={field.value} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="CASH">Tiền mặt</TabsTrigger>
                    <TabsTrigger value="TRANSFER">Chuyển khoản</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentMethod === "TRANSFER" && (
          <FormField
            control={form.control}
            name="transferCode"
            render={({ field }) => (
              <FormItem className="animate-in fade-in slide-in-from-top-2">
                <FormLabel>Mã giao dịch (Tùy chọn)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="Nhập mã giao dịch / ghi chú chuyển khoản" disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ví dụ: Ăn trưa, Tiền xăng..."
                  {...field}
                  disabled={loading}
                  rows={3}
                  className="resize-none"
                />
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
                        disabled={loading}
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
