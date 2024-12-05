export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const slug = (await params).username;


  return (
    <div>
      My Post: {slug}
      <code lang="ts">const x= 9</code>
    </div>
  );
}
