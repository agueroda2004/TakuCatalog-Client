type TitleProps = {
  title: string;
  description: string;
};

export default function SecondaryTitle({ title, description }: TitleProps) {
  return (
    <div className="mb-6 flex flex-col gap-1 border-b border-gray-200 pb-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
}
