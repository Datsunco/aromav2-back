import {
  Container,
  Heading,
  Button,
  Table,
  Badge,
  FocusModal,
  Input,
  Textarea,
  Label,
  Text,
  Switch,
} from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Calendar, Plus, Trash, Pencil } from "@medusajs/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/config";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

const eventSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Обязательное поле"),
  location: z.string().optional(),
  image_urls: z
    .array(
      z.object({
        url: z.string().url("Некорректный URL").or(z.literal("")),
      })
    )
    .optional(),
  is_published: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  location?: string;
  is_published: boolean;
  image_urls?: string[];
}

const EventsPage = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Получение списка мероприятий
  const { data, isLoading } = useQuery<{ events: Event[] }>({
    queryFn: () => sdk.client.fetch("/store/event"),
    queryKey: [["events"]],
  });

  // Форма для создания/редактирования
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      is_published: false,
      image_urls: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "image_urls",
  });

  // Мутация для создания мероприятия
  const createMutation = useMutation({
    mutationFn: (data: EventFormValues) => {
      const payload = {
        ...data,
        image_urls: data.image_urls?.map((item) => item.url) || [],
      };

      return sdk.client.fetch("/store/event", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["events"]] });
      setIsCreateModalOpen(false);
      reset();
    },
  });

  // Мутация для обновления мероприятия
  const updateMutation = useMutation({
    mutationFn: (data: EventFormValues) => {
      const payload = {
        id: editingEvent?.id,
        ...data,
        image_urls: data.image_urls?.map((item) => item.url) || [],
      };

      return sdk.client.fetch("/store/event", {
        method: "PUT",
        body: payload,
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["events"]] });
      setIsEditModalOpen(false);
      setEditingEvent(null);
      reset();
    },
  });

  // Мутация для удаления мероприятия
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch("/store/event", {
        method: "DELETE",
        body: { id },
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["events"]] });
    },
  });

  // Открытие модального окна создания
  const handleCreateClick = () => {
    reset({
      title: "",
      description: "",
      start_date: "",
      location: "",
      is_published: false,
      image_urls: [],
    });
    setIsCreateModalOpen(true);
  };

  // Открытие модального окна редактирования
  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    reset({
      title: event.title,
      description: event.description || "",
      start_date: event.start_date
        ? new Date(event.start_date).toISOString().slice(0, 16)
        : "",
      location: event.location || "",
      is_published: event.is_published,
      image_urls: [],
    });
    setIsEditModalOpen(true);
  };

  // Закрытие модальных окон
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingEvent(null);
    reset();
  };

  // Обработчик отправки формы
  const onSubmit = (data: EventFormValues) => {
    if (editingEvent) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (!isEditModalOpen) setEditingEvent(null);
  }, [isEditModalOpen]);

  useEffect(() => {
    if (!isCreateModalOpen) setEditingEvent(null);
  }, [isCreateModalOpen]);

  // Компонент формы
  const EventForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Название *</Label>
          <Input {...register("title")} />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </Text>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="is_published">Опубликовано</Label>
          <Switch {...register("is_published")} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea {...register("description")} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Дата и время *</Label>
          <Input type="datetime-local" {...register("start_date")} />
          {errors.start_date && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.start_date.message}
            </Text>
          )}
        </div>

        <div>
          <Label htmlFor="location">Место проведения</Label>
          <Input {...register("location")} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Изображения</Label>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => append({ url: "" })}
          >
            <Plus /> Добавить
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input
              {...register(`image_urls.${index}.url`)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button
              type="button"
              variant="danger"
              size="small"
              onClick={() => remove(index)}
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={closeModals}>
          Отмена
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {editingEvent ? "Обновить" : "Создать"}
        </Button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Загрузка...</div>
    );
  }

  return (
    <>
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Расписание мероприятий</Heading>
          <Button variant="primary" onClick={handleCreateClick}>
            <Plus /> Создать мероприятие
          </Button>
        </div>

        <div className="px-6">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Название</Table.HeaderCell>
                <Table.HeaderCell>Дата</Table.HeaderCell>
                <Table.HeaderCell>Место</Table.HeaderCell>
                <Table.HeaderCell>Изображения</Table.HeaderCell>
                <Table.HeaderCell>Статус</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.events?.map((event) => (
                <Table.Row key={event.id}>
                  <Table.Cell className="font-medium">{event.title}</Table.Cell>
                  <Table.Cell>
                    {format(new Date(event.start_date), "dd.MM.yyyy HH:mm")}
                  </Table.Cell>
                  <Table.Cell>{event.location || "—"}</Table.Cell>
                  <Table.Cell>
                    <Text className="text-sm text-gray-600">
                      {event.image_urls?.length || 0} изображений
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={event.is_published ? "green" : "orange"}>
                      {event.is_published ? "Опубликовано" : "Черновик"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEditClick(event)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => deleteMutation.mutate(event.id)}
                        isLoading={deleteMutation.isPending}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {(!data?.events || data.events.length === 0) && (
            <div className="text-center py-12">
              <Text className="text-gray-500">
                Мероприятий пока нет. Создайте первое мероприятие!
              </Text>
            </div>
          )}
        </div>
      </Container>

      {/* Модальное окно создания */}
      <FocusModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading level="h2">Создать мероприятие</Heading>
          </FocusModal.Header>
          <FocusModal.Body>
            <EventForm />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>

      {/* Модальное окно редактирования */}
      <FocusModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <Heading level="h2">Редактировать мероприятие</Heading>
          </FocusModal.Header>
          <FocusModal.Body>
            <EventForm />
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Мероприятия",
  icon: Calendar,
});

export default EventsPage;
