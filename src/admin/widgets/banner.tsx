import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";

// The widget
const ProductWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Banner Widget</Heading>
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  // zone: "product.details.before",
  zone: "product.details.before",
});

export default ProductWidget;
// import React, { useState, useEffect } from "react";
// import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
// import { Container, Button, Input, Switch, Label } from "@medusajs/ui";
// import { DatePicker } from "@medusajs/ui";

// const BannerWidget = () => {
//   const { data, isLoading } = useAdminCustomQuery("/admin/banner", ["banner"]);

//   const { mutate } = useAdminCustomPost("/admin/banner", ["banner"]);

//   const [content, setContent] = useState("");
//   const [isActive, setIsActive] = useState(false);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);

//   useEffect(() => {
//     if (data?.banner) {
//       setContent(data.banner.content);
//       setIsActive(data.banner.is_active);
//       setStartDate(
//         data.banner.start_date ? new Date(data.banner.start_date) : null
//       );
//       setEndDate(data.banner.end_date ? new Date(data.banner.end_date) : null);
//     }
//   }, [data]);

//   const handleSave = () => {
//     mutate({
//       content,
//       is_active: isActive,
//       start_date: startDate?.toISOString(),
//       end_date: endDate?.toISOString(),
//     });
//   };

//   return (
//     <Container>
//       <h2>Рекламный баннер</h2>
//       <div className="flex flex-col gap-4">
//         <div>
//           <Label htmlFor="content">Содержимое баннера</Label>
//           <Input
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Введите текст баннера"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Switch
//             id="active"
//             checked={isActive}
//             onCheckedChange={setIsActive}
//           />
//           <Label htmlFor="active">Активный баннер</Label>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Дата начала</Label>
//             <DatePicker value={startDate} onChange={setStartDate} />
//           </div>
//           <div>
//             <Label>Дата окончания</Label>
//             <DatePicker value={endDate} onChange={setEndDate} />
//           </div>
//         </div>

//         <Button onClick={handleSave}>Сохранить</Button>
//       </div>
//     </Container>
//   );
// };

// export default BannerWidget;
