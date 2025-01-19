export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const slug = (await params).username;
    return (
        <div>
            Username: {slug}
        </div>
    );
}

