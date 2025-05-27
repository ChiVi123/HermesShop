export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  return <div>{slugify}</div>;
}
