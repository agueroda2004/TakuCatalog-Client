type TitleProps = {
  title: string;
  description: string;
};

export default function Title({ title, description }: TitleProps) {
  return (
    <div>
      <h1 className="text-5xl font-semibold mb-4">{title}</h1>
      <p className="">{description}</p>
    </div>
  );
}
