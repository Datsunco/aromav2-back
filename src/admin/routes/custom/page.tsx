// import {
//   Container,
//   Heading,
//   Button,
//   Input,
//   Label,
//   Text,
//   clx,
// } from "@medusajs/ui";
// import { defineRouteConfig } from "@medusajs/admin-sdk";
// import { ChatBubbleLeftRight } from "@medusajs/icons";

// import { sdk } from "../../lib/config";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { Link } from "@medusajs/icons";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // Схема валидации
// const bannerSchema = z.object({
//   text: z.string().max(500, "Текст слишком длинный"),
//   link: z.string().url("Некорректный URL").or(z.literal("")),
// });

// interface BannerResponse {
//   content: string;
//   link: string;
// }

// interface BannerRequest {
//   content: string;
//   link: string;
// }

// type BannerFormValues = z.infer<typeof bannerSchema>;

// const CustomPage = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty },
//   } = useForm<BannerFormValues>({
//     resolver: zodResolver(bannerSchema),
//     defaultValues: {
//       text: "",
//       link: "",
//     },
//   });

//   const { data, isLoading } = useQuery<BannerResponse>({
//     queryFn: () => sdk.client.fetch("/store/banner"),
//     queryKey: [["banner"]],
//   });

//   const { mutate, isPending: isSubmitting } = useMutation<
//     BannerRequest,
//     Error,
//     BannerRequest
//   >({
//     mutationFn: ({ content, link }) =>
//       sdk.client.fetch("/store/banner", {
//         method: "POST", // или PUT, DELETE и т.д.
//         body: { content, link },
//         // body: ваш_объект_данных
//       }),
//   });

//   // Инициализация формы данными
//   useEffect(() => {
//     if (data) {
//       reset({
//         text: data.content || "",
//         link: data.link || "",
//       });
//     }
//   }, [data, reset]);

//   const onSubmit = handleSubmit((formData) => {
//     mutate({
//       content: formData.text,
//       link: formData.link,
//     });
//   });

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center h-64">Загрузка...</div>
//     );
//   return (
//     <Container className="divide-y p-0">
//       <div className="flex items-center justify-between px-6 py-4">
//         <Heading level="h2">This is my custom route</Heading>
//       </div>
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="flex items-center gap-x-2">
//           <Link className="text-ui-fg-subtle" />
//           <Heading level="h2">Редактирование баннера</Heading>
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className="p-6">
//         <div className="flex flex-col gap-y-6">
//           {/* Поле для текста баннера */}
//           <div>
//             <Label htmlFor="text" className="mb-2">
//               Текст баннера
//             </Label>
//             <Input
//               id="text"
//               {...register("text")}
//               placeholder="Введите текст баннера"
//             />
//             {errors.text && (
//               <Text className="text-red-500 mt-1">{errors.text.message}</Text>
//             )}
//           </div>

//           {/* Поле для ссылки */}
//           <div>
//             <Label htmlFor="link" className="mb-2">
//               Ссылка
//             </Label>
//             <Input
//               id="link"
//               {...register("link")}
//               placeholder="https://example.com"
//             />
//             {errors.link && (
//               <Text className="text-red-500 mt-1">{errors.link.message}</Text>
//             )}
//           </div>

//           <div className="flex justify-end gap-x-2 pt-4">
//             <Button
//               type="submit"
//               variant="primary"
//               isLoading={isSubmitting}
//               disabled={!isDirty || isSubmitting}
//             >
//               Сохранить
//             </Button>
//           </div>
//         </div>
//       </form>
//     </Container>
//   );
// };

// export const config = defineRouteConfig({
//   label: "Custom Route",
//   icon: ChatBubbleLeftRight,
// });

// export default CustomPage;

import { Container, Heading, Button, Input, Label, Text } from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { sdk } from "../../lib/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема валидации
const bannerSchema = z.object({
  content: z.string().max(500, "Текст слишком длинный"),
  link: z.string().url("Некорректный URL").or(z.literal("")),
});

type Banner = {
  id: string;
  content: string | null;
  link: string | null;
};

type BannerFormValues = z.infer<typeof bannerSchema>;

const CustomPage = () => {
  const { data: banner, isLoading } = useQuery<Banner>({
    queryFn: () => sdk.client.fetch("/store/banner"),
    queryKey: [["banner"]],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      content: "",
      link: "",
    },
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (data: BannerFormValues) =>
      sdk.client.fetch("/store/banner", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: [["banner"]] });
      //   notify.success("Баннер успешно сохранен");
    },
    onError: (error) => {
      //   notify.error(`Ошибка: ${error.message}`);
    },
  });

  // Инициализация формы данными
  useEffect(() => {
    if (banner) {
      reset({
        content: banner.content || "",
        link: banner.link || "",
      });
    }
  }, [banner, reset]);

  const onSubmit = handleSubmit((formData) => {
    mutate(formData);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Загрузка...</div>
    );
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Управление баннером</Heading>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="flex flex-col gap-y-6">
          {/* Поле для текста баннера */}
          <div>
            <Label htmlFor="content" className="mb-2">
              Текст баннера
            </Label>
            <Input
              id="content"
              {...register("content")}
              placeholder="Введите текст баннера"
            />
            {errors.content && (
              <Text className="text-red-500 mt-1">
                {errors.content.message}
              </Text>
            )}
          </div>

          {/* Поле для ссылки */}
          <div>
            <Label htmlFor="link" className="mb-2">
              Ссылка (необязательно)
            </Label>
            <Input
              id="link"
              {...register("link")}
              placeholder="https://example.com"
            />
            {errors.link && (
              <Text className="text-red-500 mt-1">{errors.link.message}</Text>
            )}
          </div>

          <div className="flex justify-end gap-x-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!isDirty || isSubmitting}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Баннер",
  icon: ChatBubbleLeftRight,
});

export default CustomPage;
