"use client";

import { deleteItem, saveItem } from "@/actions/SmashGraphChartFormActions";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { handleErrorWithLoading } from "@/utils/errorHandler";
import { useRouter } from "@/utils/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Trash2 } from "lucide-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const MIN_ITEMS_LENGTH = 2;
const MAX_ITEMS_LENGTH = 5;

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  status: z.enum(["published", "draft"]),
  style: z.enum(["pie-chart", "bar-chart"]),
  sort: z.enum(["default", "ranking"]),
  user_id: z
    .string({
      message: "You must be logged in.",
    })
    .min(1, {
      message: "You must be logged in.",
    }),
  items: z
    .array(
      z.object({
        title: z.string().min(1, {
          message: "Title must be at least 1 characters.",
        }),
      }),
    )
    .min(MIN_ITEMS_LENGTH, {
      message: `At least ${MIN_ITEMS_LENGTH} items are required.`,
    })
    .max(MAX_ITEMS_LENGTH, {
      message: `At most ${MAX_ITEMS_LENGTH} items are allowed.`,
    }),
});

const SmashGraphChartForm: FC<{
  itemId?: string;
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}> = ({ itemId = null, defaultValues }) => {
  const isCreate = !itemId;
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const { toast } = useToast();
  const handleError = useCallback(
    handleErrorWithLoading(toast, setIsLoading),
    [],
  );
  const handleErrorDelete = useCallback(
    handleErrorWithLoading(toast, setIsLoadingDelete),
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "No title",
      description: defaultValues?.description || "",
      status: defaultValues?.status || "draft",
      style: defaultValues?.style || "pie-chart",
      sort: defaultValues?.sort || "default",
      user_id: defaultValues?.user_id || "",
      items: defaultValues?.items || [
        {
          title: "",
        },
        {
          title: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  useEffect(() => {
    if (user) {
      // fill in the user_id field with the user's uid
      form.setValue("user_id", user.uid);
    }
  }, [user, form]);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      await handleError(
        async () => {
          await saveItem(itemId, values);
        },
        (toast) => {
          toast({
            title: "Success",
            description: isCreate
              ? `Item created: ${values.title}`
              : `Item updated: ${values.title}`,
          });
          router.push("/dashboard");
          router.refresh();
        },
      );
    },
    [itemId, handleError, router, isCreate],
  );

  const handleDelete = useCallback(async () => {
    if (!itemId) {
      return;
    }

    // TODO: dialog
    if (confirm("Are you sure you want to delete this item?")) {
      await handleErrorDelete(
        async () => {
          await deleteItem(itemId);
        },
        (toast) => {
          toast({
            title: "Success",
            description: "Item deleted",
          });
          router.push("/dashboard");
          router.refresh();
        },
      );
    }
  }, [itemId, handleErrorDelete, router]);

  return (
    <div className="w-4/5 md:w-3/5 lg:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pie-chart">Pie Chart</SelectItem>
                    <SelectItem value="bar-chart">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sort" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="ranking">Ranking</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="published">published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            Items
            <div className="flex items-center justify-between rounded-lg border px-4 my-2">
              <div className="my-4">
                {fields.map((field, index) => (
                  <div className="flex my-4 space-x-2" key={field.id}>
                    <FormField
                      control={form.control}
                      name={`items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="min-w-[320px]"
                              placeholder="name"
                              disabled={!isCreate}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isCreate && fields.length > MIN_ITEMS_LENGTH && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {isCreate && fields.length < MAX_ITEMS_LENGTH && (
                <div className="mx-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: "" })}
                  >
                    Add Item
                  </Button>
                </div>
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isCreate ? "Create" : "Update"}
            </Button>

            {/* TODO: confirm */}
            {!isCreate && (
              <Button
                variant="destructive"
                disabled={isLoadingDelete}
                onClick={handleDelete}
              >
                {isLoadingDelete && <LoaderCircle className="animate-spin" />}
                Delete
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SmashGraphChartForm;
